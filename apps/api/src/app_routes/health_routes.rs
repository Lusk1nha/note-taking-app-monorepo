use axum::{Router, routing::get};

use crate::controllers::health_controller::HealthController;

pub fn health_routes() -> Router {
    Router::new().route("/", get(HealthController::health_check))
}
