import z from "zod";

export const uploadFileSchema = z.object({
  file: z.file()
});