import psqlPool from "..";
import { CommentCK, OptionalReturn, PostCK, UserCK } from "../types";

type PostWithAuthorReturn = Pick<UserCK, "username" | "email" | "pictureUrl"> & Pick<PostCK, "title" | "content" | "createdAt">;
export const findPost = async (id: string) => {
  const postWithAuth = await psqlPool.query<OptionalReturn<PostWithAuthorReturn>>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_url AS "pictureUrl",
      posts.title,
      posts.content,
      posts.created_at as "createdAt"
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.is_published IS TRUE 
      AND posts.id = $1;
    `,
    [id],
  );

  return postWithAuth?.rows?.[0];
};

type CommentsWithAuthor = Pick<UserCK, "username" | "email" | "pictureUrl"> & Pick<CommentCK, "content" | "createdAt">;
export const findCommentsForPost = async (id: string) => {
  const commentsWithAuthors = await psqlPool.query<OptionalReturn<CommentsWithAuthor>>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_url AS "pictureUrl",
      comments.content,
      comments.created_at AS "createdAt"
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1;
    `,
    [id],
  );
  return commentsWithAuthors.rows;
};

export type FindPostsReturn = Pick<PostCK, "id" | "title" | "shortDescription" | "image" | "createdAt"> &
  Pick<UserCK, "email" | "pictureUrl" | "username">;

export const findPosts = async (cursor?: string) => {
  // TODO can this be more readable?
  const paramInjectionDependency = cursor ? [cursor] : ([] satisfies string[]);
  const { rows } = await psqlPool.query<FindPostsReturn>(
    `
      SELECT 
        posts.id,
        posts.title,
        posts.short_description AS "shortDescription",
        posts.image,
        posts.created_at AS "createdAt",
        users.email,
        users.username,
        users.picture_url AS "pictureUrl"
      FROM posts 
      JOIN users ON posts.author_id = users.id
      WHERE 
        ${(!!cursor && "posts.id > $1 AND") || ""}
        posts.is_published IS TRUE
      ORDER BY posts.id
      LIMIT 5;
      `,
    [...paramInjectionDependency],
  );

  return rows;
};
