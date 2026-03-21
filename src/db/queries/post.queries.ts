import { parseCreateQueryDependencies, parseUpdateQueryDependencies } from "@/lib/utils";
import psqlPool from "..";
import { CommentCK, OptionalReturn, PostCK, PostState, UserCK } from "../types";

export type PostWithAuthorReturn = Pick<UserCK & { pictureUrl?: string, }, "username" | "email" | "pictureUrl"> &
  Pick<PostCK & { headerImageUrl?: string; }, "title" | "shortDescription" | "content" | "createdAt" | "authorId" | "headerImageUrl" | "headerImageId">;

type FindPostProps = {
  id: number;
  state?: PostState | null;
};

export const buildPostStateCondition = ({ state, conditionsLength = 0, tableColumnName = "posts.state" }: { state: PostState; conditionsLength?: number; tableColumnName?: string; }) => {
  if (state === PostState.all) {
    return `${tableColumnName} IN ('published', 'draft')`;
  }
  return `${tableColumnName} = $${conditionsLength + 1}`;
};

export const findPost = async ({ id, state }: FindPostProps) => {
  const conditions = ["posts.id = $1"];
  const values: (string | number)[] = [id];
  if (state) {
    const isEveryPostState = state === PostState.all;
    const stateConditon = buildPostStateCondition({ conditionsLength: conditions.length, state });
    conditions.push(
      stateConditon
    );
    if (!isEveryPostState) {
      values.push(state);
    }
  }
  const whereClause = conditions.join(" AND ");
  const postWithAuth = await psqlPool.query<OptionalReturn<PostWithAuthorReturn>>(
    `
    SELECT 
      users.username,
      users.email,
      posts.author_id AS "authorId",
      posts.title,
      posts.content,
      posts.created_at as "createdAt",
      posts.state as "state",
      posts.short_description as "shortDescription",
      postFile.url as "headerImageUrl",
      postFile.id as "headerImageId",
      userFile.url as "pictureUrl"
    FROM posts
    LEFT JOIN files postFile ON posts.header_image_id = postFile.id
    JOIN users ON posts.author_id = users.id
    LEFT JOIN files userFile ON users.picture_id = userFile.id
    WHERE ${whereClause};
    `,
    values,
  );

  return postWithAuth?.rows?.[0];
};

export type CommentWithAuthor = Pick<UserCK & { pictureUrl?: string; }, "username" | "email" | "pictureUrl"> &
  Pick<CommentCK, "id" | "content" | "createdAt">;

type FindCommentsForPostProps = {
  id: number;
};
export const findCommentsForPost = async ({ id }: FindCommentsForPostProps) => {
  const commentsWithAuthors = await psqlPool.query<CommentWithAuthor>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_id AS "pictureId",
      files.url AS "pictureUrl",
      comments.id,
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

export type FindPostsReturn = Pick<PostCK & { headerImageUrl?: string; }, "id" | "title" | "createdAt" | "headerImageUrl" | "headerImageId"> &
  Pick<UserCK & { pictureUrl?: string; }, "email" | "pictureUrl" | "username">;

type FindPostsProps = {
  cursor?: number | null;
  state?: PostState | null;
};

export const findPosts = async ({ cursor = 0, state = PostState.published }: FindPostsProps) => {

  const stateParams = !state ? [] : state === PostState.all ? [PostState.draft, PostState.published] : [state];
  const paramInjectionDependency = [cursor, ...stateParams];
  const indicesToSkip = paramInjectionDependency.length - stateParams.length;
  const stateParamIndexList = paramInjectionDependency.flatMap((_, i) => {
    return i < indicesToSkip ? [] : [`$${i + 1}`];
  });

  const data = await psqlPool.query<FindPostsReturn>(
    `
      SELECT 
        posts.id,
        posts.title,
        posts.header_image_id as "headerImageId",
        posts.created_at AS "createdAt",
        posts.state,
        users.email,
        users.username,
        headerFile.url AS "headerImageUrl"
      FROM posts 
      JOIN users ON posts.author_id = users.id
      LEFT JOIN files ON users.picture_id = files.id 
      LEFT JOIN files headerFile ON posts.header_image_id = headerFile.id
      WHERE 
        posts.id > $1 AND
        posts.state IN (${stateParamIndexList.join(", ")})
      ORDER BY posts.id
      LIMIT 10;
      `,
    [...paramInjectionDependency],
  );

  return data.rows;
};

type CreatePostProps = {
  authorId: number;
  title: string;
  content: object;
  shortDescription?: string;
  headerImageId?: number;
  state?: PostState;
};

export const createPost = async (data: CreatePostProps) => {
  const { columnsString, values, pgIndicesString } = parseCreateQueryDependencies({ data });
  const query = `
    INSERT INTO posts (${columnsString})
    VALUES (${pgIndicesString})`;
  return await psqlPool.query(query, values);
};

type UpdatePostProps = {
  id: number;
  title?: string;
  content?: object;
  shortDescription?: string;
  headerImageId?: number;
  state?: PostState;
};


export const updatePost = async ({ id, ...data }: UpdatePostProps) => {
  const { columnNames, columnValues, endIndex } = parseUpdateQueryDependencies(data);
  return (
    await psqlPool.query(`
      UPDATE posts 
      SET ${columnNames}
      WHERE id = $${endIndex + 1};
    `, [...columnValues, id])
  );
};

type DeletePostProps = {
  id: number;
};

// TODO delete all images from post
export const deletePost = async ({ id }: DeletePostProps) => {
  await psqlPool.query(
    `
      DELETE FROM posts
      WHERE id = $1;
    `,
    [id],
  );
};
