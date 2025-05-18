use dotenv::dotenv;
use std::env;

#[derive(Debug, Clone)]
pub struct EnvironmentApp {
    pub manifest_dir: String,

    pub database_url: String,
    pub port: u16,

    pub is_prod: bool,
    pub jwt_secret: String,
    pub hmac_secret: String,

    pub version: String,
}

impl EnvironmentApp {
    pub fn new() -> Self {
        dotenv().ok();

        let manifest_dir = Self::get_env_var("CARGO_MANIFEST_DIR");

        let database_url = Self::get_env_var("DATABASE_URL");
        let jwt_secret = Self::get_env_var("JWT_SECRET");
        let hmac_secret = Self::get_env_var("HMAC_SECRET");

        let version = Self::get_env_var("VERSION");

        let environment = Self::get_env_var("ENVIRONMENT");
        let is_prod = environment == "production";

        let port = Self::get_env_var_with_default("PORT", "3000")
            .parse::<u16>()
            .expect("PORT must be a valid port number");

        tracing::info!("Setting up environment variables");

        Self {
            manifest_dir,

            database_url,
            port,
            is_prod,

            jwt_secret,
            hmac_secret,
            version,
        }
    }

    fn get_env_var(key: &str) -> String {
        env::var(key).unwrap_or_else(|_| panic!("{} must be set", key))
    }

    fn get_env_var_with_default(key: &str, default: &str) -> String {
        env::var(key).unwrap_or_else(|_| default.to_string())
    }
}
