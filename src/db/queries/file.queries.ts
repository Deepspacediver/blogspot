import psqlPool from "..";
import { FileCK } from "../types";

type CreateFileProps = {
  url: string;
  cloudinaryId: string;
  name: string;
  size: number;
};

export const createFile = async ({ url, cloudinaryId, name, size }: CreateFileProps) => {
  const file = await psqlPool.query<Pick<FileCK, "id" | "url">>(
    `
        INSERT INTO files (
          url, cloudinary_id, name, size
        ) VALUES (
            $1, $2, $3, $4
        ) RETURNING id, url;
      `,
    [url, cloudinaryId, name, size],
  );

  return file?.rows?.[0];
};
