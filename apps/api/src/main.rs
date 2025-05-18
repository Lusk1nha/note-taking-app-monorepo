use std::sync::Arc;

use api::{
    app_state::AppState, database::DatabaseApp, environment::EnvironmentApp, router::AppRouter,
    server::AppServer,
};
use log_service::LogService;
use tokio::sync::Notify;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _guard = LogService::default()?;
    tracing::info!("Starting application initialization");

    let environment = EnvironmentApp::new();
    let database = DatabaseApp::new(&environment).await?;
    database.run_migrations().await?;

    let app_state = AppState::new(environment, database);
    let app_routes = AppRouter::create_api_routes(app_state.clone()).await?;

    let shutdown_signal = Arc::new(Notify::new());
    let server_task = tokio::spawn({
        let shutdown_signal = shutdown_signal.clone();
        let app_server = AppServer::new(app_state.clone(), shutdown_signal.clone());
        async move { app_server.start_server(app_routes).await }
    });

    tokio::select! {
        res = server_task => {
            match res {
                Ok(Ok(_)) => tracing::info!("Server shutdown normally"),
                Ok(Err(e)) => {
                    tracing::error!(error = %e, "Server task failed");
                    return Err(e.into());
                }
                Err(join_err) => {
                    tracing::error!(error = %join_err, "Server task panicked");
                    return Err(join_err.into());
                }
            }
        }
        _ = tokio::signal::ctrl_c() => {
            tracing::warn!("Received SIGINT signal, initiating graceful shutdown");
            shutdown_signal.notify_one();
        }
    }

    app_state.database.close_pool().await?;
    tracing::info!("Database connection pool closed");

    Ok(())
}
