CREATE TABLE short_link(
    id UUID PRIMARY KEY,
    short_code VARCHAR(6) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);