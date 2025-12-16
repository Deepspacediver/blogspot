import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(3),
  userId: z.number(),
  postId: z.number(),
});

export const deleteCommentSchema = z.object({
  userId: z.number(),
  commentId: z.number(),
});
