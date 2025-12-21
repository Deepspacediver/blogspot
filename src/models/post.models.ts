import z from "zod";

export const findPostsSchema = z.object({
  cursor: z.number().min(1).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(3),
  // TODO temporary type, adjust once admin FE is done
  content: z.string(),
  shortDescription: z.string().optional(),
  image: z.file().optional(),
  isPublished: z.boolean().optional().default(true),
});
