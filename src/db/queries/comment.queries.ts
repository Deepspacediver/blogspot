"use server";

import psqlPool from "..";
import { CommentCK, PostCK } from "../types";

type CreateCommentProps = {
  postId: number;
  userId: number;
  content: string;
};

export const createComment = async ({ postId, userId, content }: CreateCommentProps) => {
  await psqlPool.query(
    `
    INSERT INTO comments (content, user_id, post_id)
      VALUES ($1, $2, $3)
    `,
    [content, userId, postId],
  );
};

type DeleteCommentProps = {
  userId: number;
  commentId: number;
  canDeleteWithoutAuthorship?: boolean;
};

export const deleteComment = async ({ userId, commentId, canDeleteWithoutAuthorship = false }: DeleteCommentProps) => {
  const paramInjectionDeps = canDeleteWithoutAuthorship ? [commentId] : [commentId, userId];
  const query = `DELETE FROM comments 
                  USING posts WHERE comments.post_id = posts.id
                  AND comments.id = $1 
                  ${!canDeleteWithoutAuthorship ? `AND comments.user_id = $2` : ""}`;
  await psqlPool.query(query, paramInjectionDeps);
};

type GetCommentPostAuthorIdProps = {
  commentId: number;
  postId: number;
};

export const getCommentPostAuthorId = async ({ commentId, postId }: GetCommentPostAuthorIdProps) => {
  const postAuthor = await psqlPool.query<Pick<PostCK & CommentCK, "authorId" | "userId">>(
    `
        SELECT posts.author_id AS authorId, comments.user_id AS userId
          FROM comments JOIN posts 
          ON comments.post_id = posts.id
          WHERE comments.id = $1 AND posts.id = $2;
    `,
    [commentId, postId],
  );
  return postAuthor?.rows?.[0];
};
