CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    email_verified TIMESTAMPTZ,

    image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    session_token TEXT UNIQUE NOT NULL,

    expires TIMESTAMPTZ NOT NULL
);


CREATE TABLE verification_token (
    identifier TEXT NOT NULL,

    token TEXT NOT NULL,

    expires TIMESTAMPTZ NOT NULL,

    PRIMARY KEY(identifier, token)
);