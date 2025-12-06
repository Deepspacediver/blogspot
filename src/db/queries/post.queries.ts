import psqlPool from "..";
import { CommentCK, OptionalReturn, PostCK, UserCK } from "../types";

type PostWithAuthorReturn = Pick<UserCK & PostCK, "username" | "email" | "pictureUrl" | "title" | "content">;
export const findPost = async (id: string) => {
  const postWithAuth = await psqlPool.query<OptionalReturn<PostWithAuthorReturn>>(
    `
    SELECT 
      users.username,
      users.email,
      users.picture_url AS "pictureUrl",
      posts.title,
      posts.content
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.is_published IS TRUE 
      AND posts.id = $1;
    `,
    [id],
  );

  return postWithAuth?.rows?.[0];
};

// TODO there is mix of fields, createdAt from user and createdAt from comment
type CommentsWithAuthor = Pick<UserCK & CommentCK, "username" | "email" | "pictureUrl" | "content" | "createdAt">;

export const findCommentsForPost = async (id: string) => {
  const commentsWithAuthors = await psqlPool.query<CommentsWithAuthor>(
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
