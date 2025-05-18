-- Add up migration script here
CREATE TABLE IF NOT EXISTS credentials (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_timestamp_credentials'
    AND tgrelid = 'credentials'::regclass
  ) THEN
    CREATE TRIGGER trigger_update_timestamp_credentials 
    BEFORE UPDATE ON credentials 
    FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
  END IF;
END
$$;