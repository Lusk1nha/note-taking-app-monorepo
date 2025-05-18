use std::sync::Arc;

use crate::{database::DatabaseApp, environment::EnvironmentApp};

#[derive(Clone)]
pub struct AppState {
    pub database: DatabaseApp,
    pub environment: EnvironmentApp,
}

impl AppState {
    pub fn new(environment: EnvironmentApp, database: DatabaseApp) -> Arc<Self> {
        tracing::info!("Setting up application state");

        Arc::new(Self {
            database,
            environment,
        })
    }
}
