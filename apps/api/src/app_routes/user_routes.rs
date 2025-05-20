use std::sync::Arc;

use axum::{Router, middleware, routing::get};

use crate::{
    controllers::user_controller::UserController, middlewares::auth_middleware::auth_middleware,
    services::service_register::ServiceRegister,
};

pub fn user_routes(services: Arc<ServiceRegister>) -> Router {
    Router::new()
        .route("/", get(UserController::get_users))
        .route("/me", get(UserController::get_current_user))
        .route("/{user_id}", get(UserController::get_user_by_id))
        .layer(middleware::from_fn_with_state(
            services.clone(),
            auth_middleware,
        ))
        .with_state(services)
}
