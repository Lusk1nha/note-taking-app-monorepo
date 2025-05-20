use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};

use crate::entities::claims_entity::Claims;

pub trait JwtServiceTrait {
    fn generate_token(&self, user_id: &str) -> Result<String, jsonwebtoken::errors::Error>;
    fn decode_token(&self, token: &str) -> Result<Claims, jsonwebtoken::errors::Error>;
}

#[derive(Clone)]
pub struct JwtService {
    secret: String,
}


impl JwtService {
    pub fn new(secret: String) -> Self {
        Self { secret }
    }
}

impl JwtServiceTrait for JwtService {
    fn generate_token(&self, user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
        let claims = Claims {
            sub: user_id.to_string(),
            exp: Utc::now()
                .checked_add_signed(Duration::days(1))
                .expect("valid timestamp")
                .timestamp() as usize,
            iat: Utc::now().timestamp() as usize,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
    }

    fn decode_token(&self, token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
    }
}
