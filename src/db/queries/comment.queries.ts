"use server";

import psqlPool from "..";

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
  isAdmin?: boolean;
};

export const deleteComment = async ({ userId, commentId, isAdmin = false }: DeleteCommentProps) => {
  const paramInjectionDeps = isAdmin ? [commentId] : [commentId, userId];
  await psqlPool.query(
    `
    DELETE FROM comments 
      WHERE id = $1 
      ${!isAdmin ? `AND user_id = $2` : ""};
    `,
    paramInjectionDeps,
  );
};
