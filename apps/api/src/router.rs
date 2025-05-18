use axum::Router;
use std::sync::Arc;

use crate::{
    app_routes::{
        auth_routes::auth_routes, health_routes::health_routes, root_routes::root_routes,
    },
    app_state::AppState,
    common::cors::AppCors,
    controllers::not_found_controller::NotFoundController,
    services::service_register::ServiceRegister,
};

const API_NEST_PATH: &str = "/api";
const API_HEALTH_PATH: &str = "/health";
const API_AUTH_PATH: &str = "/auth";

const API_VERSION: &str = "/v1";

pub struct AppRouter;

impl AppRouter {
    pub async fn create_api_routes(state: Arc<AppState>) -> Result<Router, anyhow::Error> {
        tracing::info!("Configuring API routes");

        let allowed_origins = vec!["http://localhost:3000", "https://example.com"];

        let app_cors = AppCors::new(allowed_origins)?;

        let services: Arc<ServiceRegister> = ServiceRegister::new(state);

        let versioned_routes = Router::new().nest(API_VERSION, Self::build_v1_routes(services));

        let api_routes = Router::new()
            .nest(API_NEST_PATH, versioned_routes)
            .layer(app_cors.create_cors_layer());

        Ok(Router::new()
            .merge(api_routes)
            .fallback(NotFoundController::not_found_route))
    }

    fn build_v1_routes(services: Arc<ServiceRegister>) -> Router {
        tracing::info!("Building v1 routes under {}{}", API_NEST_PATH, API_VERSION);

        let root_routes = root_routes();
        let health_routes = health_routes();
        let auth_routes = auth_routes(services.clone());

        Router::new()
            .merge(root_routes)
            .nest(API_HEALTH_PATH, health_routes)
            .nest(API_AUTH_PATH, auth_routes)
            .fallback(NotFoundController::version_not_found)
    }
}
