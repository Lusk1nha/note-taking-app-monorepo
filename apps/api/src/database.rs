use sqlx::migrate::Migrator;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, sleep};

use sqlx::{Error, Pool, Postgres, postgres::PgPoolOptions};

use crate::environment::EnvironmentApp;

pub type AppDatabasePool = Pool<Postgres>;

#[derive(Debug, Clone)]
pub struct DatabaseApp {
    pub pool: Arc<Mutex<AppDatabasePool>>,
    environment: EnvironmentApp,
}

impl DatabaseApp {
    pub async fn new(environment: &EnvironmentApp) -> Result<Self, Error> {
        let pool = Self::create_pool(&environment.database_url).await?;
        let database_app = Self {
            pool: Arc::new(Mutex::new(pool)),
            environment: environment.clone(),
        };

        database_app.start_auto_reconnect();

        tracing::info!("Database connection pool created");
        Ok(database_app)
    }

    pub async fn create_pool(url: &str) -> Result<Pool<Postgres>, Error> {
        PgPoolOptions::new().max_connections(20).connect(url).await
    }

    pub async fn close_pool(&self) -> Result<(), Error> {
        tracing::info!("Closing database connection pool");
        let pool = self.pool.lock().await;
        pool.close().await;
        Ok(())
    }

    pub async fn run_migrations(&self) -> Result<(), Error> {
        const MIGRATIONS_DIR: &str = "migrations";

        let directory = self.get_migrations_dir(MIGRATIONS_DIR)?;
        let pool = self.pool.lock().await;

        Migrator::new(directory).await?.run(&*pool).await?;
        tracing::info!("Database migrations completed successfully");

        Ok(())
    }

    fn get_migrations_dir(&self, migrations_dir_name: &str) -> Result<PathBuf, Error> {
        let source_dir = self.environment.manifest_dir.clone();
        let join_current = PathBuf::from(source_dir).join(migrations_dir_name);

        let directory = Path::new(&join_current);

        if !directory.exists() {
            tracing::error!("Migrations directory '{}' not found", migrations_dir_name);

            return Err(Error::Configuration(
                format!(
                    "Migrations directory '{}' does not exist",
                    migrations_dir_name
                )
                .into(),
            ));
        }

        Ok(directory.to_path_buf())
    }

    fn start_auto_reconnect(&self) {
        let pool = Arc::clone(&self.pool);
        let url = self.environment.database_url.clone();

        tokio::spawn(async move {
            loop {
                let is_closed = {
                    let pool = pool.lock().await;
                    pool.is_closed()
                };

                if is_closed {
                    tracing::info!("Attempting to reconnect to the database...");

                    match Self::create_pool(&url).await {
                        Ok(new_pool) => {
                            tracing::info!("Reconnected to the database.");

                            let mut pool = pool.lock().await;
                            *pool = new_pool;
                        }
                        Err(e) => {
                            tracing::error!("Failed to reconnect: {:?}", e);
                        }
                    }
                }

                sleep(Duration::from_secs(10)).await;
            }
        });
    }
}

impl Drop for DatabaseApp {
    fn drop(&mut self) {
        let pool = Arc::clone(&self.pool);
        tokio::spawn(async move {
            let pool = pool.lock().await;
            pool.close().await;
            tracing::info!("Database connection pool closed during drop");
        });
    }
}
