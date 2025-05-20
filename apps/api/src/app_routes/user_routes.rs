use std::sync::Arc;

use axum::{Router, middleware, routing::get};

use crate::{
    common::roles::Role,
    controllers::user_controller::UserController,
    middlewares::{
        auth_middleware::create_default_auth_middleware,
        required_roles_middleware::RequiredRolesMiddleware,
    },
    services::service_register::ServiceRegister,
};

pub fn user_routes(services: Arc<ServiceRegister>) -> Router {
    let auth_middleware = create_default_auth_middleware(services.clone());

    Router::new()
        .route("/", get(UserController::get_users))
        .route_layer(middleware::from_fn(move |req, next| {
            let required_middleware = RequiredRolesMiddleware::new(vec![Role::Admin]);
            required_middleware.handle(req, next)
        }))
        .route("/me", get(UserController::get_current_user))
        .route("/{user_id}", get(UserController::get_user_by_id))
        .layer(middleware::from_fn(move |req, next| {
            let auth = auth_middleware.clone();
            async move { auth.handle(req, next).await }
        }))
        .with_state(services)
}
