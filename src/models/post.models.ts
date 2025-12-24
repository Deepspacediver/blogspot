import z from "zod";

export const findPostsSchema = z.object({
  cursor: z.number().min(1).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(3),
  // TODO temporary type, adjust once admin FE is done
  content: z.string(),
  shortDescription: z.string().optional(),
  // TODO change to imageId
  image: z.url().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  shortDescription: z.string().optional(),
  image: z.url().optional(),
  isPublished: z.boolean().optional(),
});
