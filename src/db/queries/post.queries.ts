import psqlPool from "..";
import { CommentCK, OptionalReturn, PostCK, UserCK } from "../types";

export type PostWithAuthorReturn = Pick<UserCK, "username" | "email" | "pictureUrl"> &
  Pick<PostCK, "title" | "shortDescription" | "content" | "image" | "createdAt">;

type FindPostProps = {
  id: number;
  isOnlyPublished?: boolean;
};

export const findPost = async ({ id, isOnlyPublished = true }: FindPostProps) => {
  const postWithAuth = await psqlPool.query<OptionalReturn<PostWithAuthorReturn>>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_url AS "pictureUrl",
      posts.title,
      posts.content,
      posts.created_at as "createdAt",
      posts.short_description as "shortDescription"
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = $1 
    ${isOnlyPublished ? "AND posts.is_published IS TRUE" : ""};
    `,
    [id],
  );

  return postWithAuth?.rows?.[0];
};

export type CommentWithAuthor = Pick<UserCK, "username" | "email" | "pictureUrl"> &
  Pick<CommentCK, "id" | "content" | "createdAt">;

type FindCommentsForPostProps = {
  id: number;
  isOnlyPublished?: boolean;
};
export const findCommentsForPost = async ({ id }: FindCommentsForPostProps) => {
  const commentsWithAuthors = await psqlPool.query<CommentWithAuthor>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_url AS "pictureUrl",
      comments.id,
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

export type FindPostsReturn = Pick<PostCK, "id" | "title" | "createdAt" | "image"> &
  Pick<UserCK, "email" | "pictureUrl" | "username">;

type FindPostsProps = {
  cursor?: number;
  isOnlyPublished?: boolean;
};

export const findPosts = async ({ cursor, isOnlyPublished = true }: FindPostsProps) => {
  // TODO can this be more readable?
  const paramInjectionDependency = cursor ? [cursor] : [];
  const { rows } = await psqlPool.query<FindPostsReturn>(
    `
      SELECT 
        posts.id,
        posts.title,
        posts.image,
        posts.created_at AS "createdAt",
        posts.is_published as "isPublished",
        users.email,
        users.username,
        users.picture_url AS "pictureUrl"
      FROM posts 
      JOIN users ON posts.author_id = users.id
      WHERE 
        ${cursor ? "posts.id > $1 AND" : ""}
        ${isOnlyPublished ? "posts.is_published IS TRUE AND" : ""}
        posts.is_published IS TRUE
      ORDER BY posts.id
      LIMIT 5;
      `,
    [...paramInjectionDependency],
  );

  return rows;
};
