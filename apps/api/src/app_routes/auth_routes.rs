use std::sync::Arc;

use axum::{Router, routing::post};

use crate::{
    controllers::auth_controller::AuthController, services::service_register::ServiceRegister,
};

pub fn auth_routes(state: Arc<ServiceRegister>) -> Router {
    Router::new()
        .route("/login", post(AuthController::login_with_credentials))
        .route("/register", post(AuthController::register_with_credentials))
        .with_state(state)
}
