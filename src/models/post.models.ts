import z from "zod";

export const findPostsSchema = z.object({
  cursor: z.coerce.number().min(1).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.looseObject({}),
  shortDescription: z.string().optional(),
  headerImageId: z.number().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  shortDescription: z.string().optional(),
  headerImageId: z.url().optional(),
  isPublished: z.boolean().optional(),
});
