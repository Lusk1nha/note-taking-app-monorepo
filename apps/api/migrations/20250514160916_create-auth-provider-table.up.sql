-- Add up migration script here
CREATE TYPE auth_provider_type AS ENUM ('GOOGLE', 'CREDENTIALS');
CREATE TABLE auth_providers (
  id VARCHAR(255) PRIMARY KEY,
  type auth_provider_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);