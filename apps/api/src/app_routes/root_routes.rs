use axum::{Router, routing::get};

use crate::controllers::root_controller::RootController;

pub fn root_routes() -> Router {
    Router::new().route("/", get(RootController::index))
}
