import { PostState } from "@/db/types";
import z from "zod";

export const findPostsSchema = z.object({
  cursor: z.coerce.number().min(0).nullable().optional(),
  state: z.enum(PostState).nullable().optional().default(PostState.published),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().transform((value) => JSON.parse(value)).pipe(z.looseObject({})),
  shortDescription: z.string().optional(),
  image: z.file().optional(),
  state: z.enum(PostState).optional().default(PostState.published),
});
export const updatePostSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1).optional(),
  content: z.string().transform((value) => JSON.parse(value)).pipe(z.looseObject({})).optional(),
  shortDescription: z.string().optional(),
  image: z.file().optional(),
  state: z.enum(PostState).exclude([PostState.all]).optional(),
});
