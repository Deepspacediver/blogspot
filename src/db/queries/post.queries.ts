"use server";

import { parseCreateQueryDependencies, parseUpdateQueryDependencies } from "@/lib/utils";
import psqlPool from "..";
import { CommentCK, OptionalReturn, PostCK, PostState, UserCK } from "../types";
import { PoolClient } from "pg";
import * as fileQueries from "./file.queries";
import { FETCH_LIMIT } from "@/constants/fetch-states";

export type PostWithAuthorReturn = Pick<UserCK & { pictureUrl?: string }, "username" | "email" | "pictureUrl"> &
  Pick<PostCK & { headerImageUrl?: string }, "title" | "shortDescription" | "content" | "createdAt" | "authorId" | "headerImageUrl" | "headerImageId">;

type FindPostProps = {
  id: number;
  state?: PostState | null;
};

const resolveStates = (state?: PostState | null): PostState[] => {
  if (!state) return [];
  if (state === PostState.all) return [PostState.draft, PostState.published];
  return [state];
};

export const findPost = async ({ id, state }: FindPostProps) => {
  const states = resolveStates(state);
  const conditions = ["posts.id = $1"];
  const values: unknown[] = [id];

  if (states.length > 0) {
    values.push(states);
    conditions.push(`posts.state = ANY($${values.length})`);
  }

  const query = `
    SELECT 
      posts.id,
      users.username,
      users.email,
      posts.author_id AS "authorId",
      posts.title,
      posts.content,
      posts.created_at AS "createdAt",
      posts.state AS "state",
      posts.short_description AS "shortDescription",
      postFile.url AS "headerImageUrl",
      postFile.id AS "headerImageId",
      userFile.url AS "pictureUrl"
    FROM posts
    LEFT JOIN files postFile ON posts.header_image_id = postFile.id
    JOIN users ON posts.author_id = users.id
    LEFT JOIN files userFile ON users.picture_id = userFile.id
    WHERE ${conditions.join(" AND ")};
  `;

  const postWithAuth = await psqlPool.query<OptionalReturn<PostWithAuthorReturn>>(query, values);
  return postWithAuth?.rows?.[0];
};

export type CommentWithAuthor = Pick<UserCK & { pictureUrl?: string }, "username" | "email" | "pictureUrl"> &
  Pick<CommentCK, "id" | "userId" | "content" | "createdAt">;

type FindCommentsForPostProps = {
  id: number;
};

export const findCommentsForPost = async ({ id }: FindCommentsForPostProps) => {
  const commentsWithAuthors = await psqlPool.query<CommentWithAuthor>(
    `
    SELECT 
      users.username,
      users.email,
      files.url AS "pictureUrl",
      comments.id,
      comments.user_id AS "userId",
      comments.content,
      comments.created_at AS "createdAt"
    FROM comments
    JOIN users ON comments.user_id = users.id
    LEFT JOIN files ON users.picture_id = files.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at DESC;
    `,
    [id],
  );
  return commentsWithAuthors.rows;
};

export type FindPostsReturn = Pick<PostCK & { headerImageUrl?: string }, "id" | "title" | "createdAt" | "headerImageUrl" | "headerImageId" | "shortDescription"> &
  Pick<UserCK & { pictureUrl?: string }, "email" | "pictureUrl" | "username">;

type FindPostsProps = {
  cursor?: number | null;
  state?: PostState | null;
  limit?: number | null;
};

export const findPosts = async ({
  cursor = 0,
  state = PostState.published,
  limit = FETCH_LIMIT,
}: FindPostsProps = {}) => {
  const states = resolveStates(state);
  const conditions = ["posts.id > $1"];
  const values: unknown[] = [cursor ?? 0];

  if (states.length > 0) {
    values.push(states);
    conditions.push(`posts.state = ANY($${values.length})`);
  }

  values.push(limit ?? FETCH_LIMIT);
  const limitIndex = values.length;

  const query = `
    SELECT 
      posts.id,
      posts.title,
      posts.header_image_id AS "headerImageId",
      posts.created_at AS "createdAt",
      posts.short_description AS "shortDescription",
      posts.state,
      users.email,
      users.username,
      headerFile.url AS "headerImageUrl"
    FROM posts 
    JOIN users ON posts.author_id = users.id
    LEFT JOIN files ON users.picture_id = files.id 
    LEFT JOIN files headerFile ON posts.header_image_id = headerFile.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY posts.id
    LIMIT $${limitIndex};
  `;

  const data = await psqlPool.query<FindPostsReturn>(query, values);
  return data.rows;
};

type CreatePostProps = {
  data: {
    authorId: number;
    title: string;
    content: object;
    shortDescription?: string;
    headerImageId?: number;
    state?: PostState;
  };
  txClient?: PoolClient;
};

export const createPost = async ({ data, txClient }: CreatePostProps) => {
  const { columnsString, values, pgIndicesString } = parseCreateQueryDependencies({ data });
  const query = `
    INSERT INTO posts (${columnsString})
    VALUES (${pgIndicesString})
    RETURNING id;
  `;
  const dbClient = txClient || psqlPool;
  const post = await dbClient.query<Pick<PostCK, "id">>(query, values);
  return post.rows[0];
};

type UpdatePostProps = {
  data: {
    id: number;
    title?: string;
    content?: object;
    shortDescription?: string;
    headerImageId?: number;
    state?: PostState;
  };
  txClient?: PoolClient;
};

export const updatePost = async ({ data: { id, ...postData }, txClient }: UpdatePostProps) => {
  const { columnNames, columnValues, endIndex } = parseUpdateQueryDependencies({ data: postData });
  if (columnValues.length === 0) {
    return null;
  }

  const dbClient = txClient || psqlPool;
  return await dbClient.query(
    `
      UPDATE posts 
      SET ${columnNames}
      WHERE id = $${endIndex + 1};
    `,
    [...columnValues, id],
  );
};

type DeletePostProps = {
  id: number;
  txClient?: PoolClient;
};

export const deletePost = async ({ id, txClient }: DeletePostProps) => {
  const dbClient = txClient || psqlPool;
  const imagesFromPost = (
    await fileQueries.getFilesFromPost({ postId: id, txClient })
  ).map(({ cloudinaryId }) => cloudinaryId);

  await dbClient.query(
    `
      DELETE FROM posts
      WHERE id = $1;
    `,
    [id],
  );

  await fileQueries.deleteCloudinaryFiles({ ids: imagesFromPost });
};
