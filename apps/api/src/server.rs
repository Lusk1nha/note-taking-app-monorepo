use axum::Router;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::Notify;

use crate::app_state::AppState;

pub struct AppServer {
    pub app_state: Arc<AppState>,
    pub shutdown_signal: Arc<Notify>,
}

impl AppServer {
    pub fn new(app_state: Arc<AppState>, shutdown_signal: Arc<Notify>) -> Self {
        Self {
            app_state,
            shutdown_signal,
        }
    }

    pub async fn start_server(&self, api_routes: Router) -> Result<(), anyhow::Error> {
        let address = Self::get_address_by_environment(
            self.app_state.environment.is_prod,
            self.app_state.environment.port,
        );

        let listener = tokio::net::TcpListener::bind(&address).await?;
        tracing::info!("Server started on the address: {}", address);

        let shutdown_signal_clone = self.shutdown_signal.clone();
        let shutdown_future = async move {
            shutdown_signal_clone.notified().await;
            tracing::info!("Shutdown signal received, stopping server gracefully...");
        };

        axum::serve(listener, api_routes)
            .with_graceful_shutdown(shutdown_future)
            .await?;

        tracing::info!("Server stopped gracefully");
        Ok(())
    }

    fn get_address_by_environment(is_prod: bool, port: u16) -> SocketAddr {
        let ip = if is_prod {
            [0, 0, 0, 0]
        } else {
            [127, 0, 0, 1]
        };

        SocketAddr::from((ip, port))
    }
}
