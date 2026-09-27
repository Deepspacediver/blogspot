  DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'state') THEN
            CREATE TYPE state AS ENUM('published', 'draft');
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null,
        picture_id INTEGER,
        role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'USER'))
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        content JSONB,
        short_description VARCHAR(300),
        author_id INTEGER NOT NULL,
        state STATE DEFAULT 'draft' NOT NULL,
        header_image_id INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null
      );

      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL,
        post_id INTEGER,
        size INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        url TEXT,
        cloudinary_id TEXT
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        content TEXT NOT NULL DEFAULT '',
        user_id INTEGER,
        post_id INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT null
      );

      ALTER TABLE users ADD CONSTRAINT fk_users_picture_id FOREIGN KEY (picture_id) REFERENCES files(id) ON DELETE SET NULL; 
      ALTER TABLE posts ADD CONSTRAINT fk_posts_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE; 
      ALTER TABLE posts ADD CONSTRAINT fk_posts_header_image_id FOREIGN KEY (header_image_id) REFERENCES files(id) ON DELETE SET NULL; 
      ALTER TABLE files ADD CONSTRAINT fk_files_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
      ALTER TABLE comments ADD CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
      ALTER TABLE comments ADD CONSTRAINT fk_comments_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_files_post_id ON files(post_id);
      CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
