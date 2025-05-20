use std::{collections::HashSet, sync::Arc};

use axum::{
    body::Body,
    extract::Request,
    http::{HeaderMap, header::AUTHORIZATION},
    middleware::Next,
    response::IntoResponse,
};
use uuid::Uuid;

use crate::{
    common::{error_response::ErrorResponse, roles::Role},
    errors::request_response_errors::{forbidden_error, unauthorized_error},
    services::{
        jwt_service::JwtServiceTrait,
        roles_service::{RoleChecker, UserRoleChecker},
        service_register::ServiceRegister,
    },
};

#[derive(Clone)]
pub struct AuthMiddleware {
    jwt_decoder: Arc<dyn JwtServiceTrait + Send + Sync>,
    role_checker: Arc<dyn RoleChecker + Send + Sync>,
}

impl AuthMiddleware {
    pub fn new(
        jwt_decoder: Arc<dyn JwtServiceTrait + Send + Sync>,
        role_checker: Arc<dyn RoleChecker + Send + Sync>,
    ) -> Self {
        Self {
            jwt_decoder,
            role_checker,
        }
    }

    pub async fn handle(
        self,
        mut req: Request<Body>,
        next: Next,
    ) -> Result<impl IntoResponse, ErrorResponse> {
        let headers = req.headers().clone();
        let token = Self::extract_token(&headers);

        let user_id = self.authenticate(token).await?;
        let roles = self.authorize(user_id).await?;

        println!("User ID: {}", user_id);
        println!("Roles: {:?}", roles);

        req.extensions_mut().insert(user_id);
        req.extensions_mut().insert(roles);

        Ok(next.run(req).await)
    }

    fn extract_token(headers: &HeaderMap) -> Option<String> {
        headers
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .and_then(|s| s.strip_prefix("Bearer "))
            .map(|s| s.trim().to_string())
    }

    async fn authenticate(&self, token: Option<String>) -> Result<Uuid, ErrorResponse> {
        let token = token.ok_or_else(|| unauthorized_error("Token must be provided"))?;

        let claims = self
            .jwt_decoder
            .decode_token(&token)
            .map_err(|e| unauthorized_error(format!("Invalid token: {}", e)))?;

        Uuid::parse_str(&claims.sub)
            .map_err(|e| unauthorized_error(format!("User id is invalid: {}", e)))
    }

    async fn authorize(&self, user_id: Uuid) -> Result<HashSet<Role>, ErrorResponse> {
        let roles = self
            .role_checker
            .get_roles(user_id)
            .await
            .into_iter()
            .flat_map(|roles| roles.into_iter())
            .collect::<HashSet<_>>();

        if roles.is_empty() {
            Err(forbidden_error("User does not have any roles"))
        } else {
            Ok(roles)
        }
    }
}

pub fn create_default_auth_middleware(services: Arc<ServiceRegister>) -> AuthMiddleware {
    AuthMiddleware::new(
        services.jwt_service.clone(),
        Arc::new(UserRoleChecker::new(
            services.user_service.clone(),
            services.admin_service.clone(),
        )),
    )
}
