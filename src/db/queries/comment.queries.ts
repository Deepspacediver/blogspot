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
