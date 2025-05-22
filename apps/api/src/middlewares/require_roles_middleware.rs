use axum::{body::Body, http::Request, middleware::Next, response::IntoResponse};
use std::collections::HashSet;

use crate::{
    common::{error_response::ErrorResponse, roles::Role},
    errors::request_response_errors::{forbidden_error, internal_server_error},
};

#[derive(Clone)]
pub struct RequireAnyRoleMiddleware {
    required_roles: HashSet<Role>,
}

impl RequireAnyRoleMiddleware {
    pub fn new(roles: Vec<Role>) -> Self {
        let required_roles = roles.into_iter().collect::<HashSet<_>>();
        Self { required_roles }
    }

    pub async fn handle(
        self,
        req: Request<Body>,
        next: Next,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let user_roles = req
            .extensions()
            .get::<HashSet<Role>>()
            .ok_or_else(|| internal_server_error("User roles not found in context".to_string()))?;

        if self.required_roles.is_disjoint(user_roles) {
            return Err(forbidden_error("Insufficient permissions"));
        }

        Ok(next.run(req).await)
    }
}
