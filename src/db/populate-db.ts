import dbClient from ".";

export const populateDb = async () => {
  try {
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null,
        picture_url TEXT,
        role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        short_description VARCHAR(300),
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null
      );

      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL UNIQUE,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        size INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        content TEXT NOT NULL DEFAULT '',
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null
      );
      `);
  } catch (e) {
    console.error(e);
  }
};
