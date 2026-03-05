import { PostState } from "@/db/types";
import z from "zod";

export const findPostsSchema = z.object({
  cursor: z.coerce.number().min(0).nullable().optional(),
  state: z.enum(PostState).nullable().optional().default(PostState.published),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.looseObject({}),
  shortDescription: z.string().optional(),
  headerImageId: z.number().optional(),
  state: z.enum(PostState).optional().default(PostState.published),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.looseObject({}).optional(),
  shortDescription: z.string().optional(),
  headerImageId: z.number().optional(),
  state: z.enum(PostState).optional(),
});
