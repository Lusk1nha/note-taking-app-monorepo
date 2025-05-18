-- Add up migration script here
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(100),
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM pg_trigger
  WHERE tgname = 'trigger_update_timestamp_users'
    AND tgrelid = 'users'::regclass
) THEN CREATE TRIGGER trigger_update_timestamp_users BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
END IF;
END $$;