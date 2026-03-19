import { cloudinaryClient } from "@/config/cloudinary.config";
import psqlPool from "..";
import { FileCK } from "../types";
import { parseFileForUpload } from "@/lib/utils";

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


type UploadFileToCloudinaryProps = {
  file: File;
};
export async function uploadFileToCloudinary({ file }: UploadFileToCloudinaryProps) {
  const { fileUri } = await parseFileForUpload({ file });
  const response = await cloudinaryClient.uploader.upload(fileUri, {
    filename_override: file.name,
    folder: "blogspot",
    use_filename: true
  });
  return { ...response, size: file.size };
}
type DeleteFileProps = {
  id: number;
};

export const deleteFile = async ({ id }: DeleteFileProps) => {
  await psqlPool.query(`
    DELETE FROM files WHERE id = $1`, [id]);
};