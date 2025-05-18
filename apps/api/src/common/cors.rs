use axum::http::{
    HeaderValue, Method,
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
};
use tower_http::cors::CorsLayer;

pub struct AppCors {
    pub allow_origin: HeaderValue,
}

impl AppCors {
    pub fn new(allowed_origins: Vec<&str>) -> Result<Self, anyhow::Error> {
        let origin = Self::get_origin(allowed_origins);

        Ok(Self {
            allow_origin: origin,
        })
    }

    pub fn create_cors_layer(&self) -> CorsLayer {
        CorsLayer::new()
            .allow_origin(self.allow_origin.clone())
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::PATCH,
                Method::DELETE,
            ])
            .allow_credentials(true)
            .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE])
    }

    fn get_origin(origins: Vec<&str>) -> HeaderValue {
        let origin = origins
            .into_iter()
            .map(|origin| HeaderValue::from_str(origin))
            .collect::<Result<Vec<_>, _>>()
            .unwrap_or_else(|_| vec![HeaderValue::from_static("*")]);

        origin
            .get(0)
            .cloned()
            .unwrap_or_else(|| HeaderValue::from_static("*"))
    }
}
