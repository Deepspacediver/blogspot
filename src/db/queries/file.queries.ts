import { cloudinaryClient } from "@/config/cloudinary.config";
import psqlPool from "..";
import { FileCK } from "../types";
import { parseFileForUpload, parseUpdateQueryDependencies } from "@/lib/utils";
import { PoolClient } from "pg";

type CreateFileProps = {
  data: {
    url: string;
    cloudinaryId: string;
    name: string;
    size: number;
    postId?: number;
  };
  txClient?: PoolClient;
};

export const createFile = async ({ data: { url, cloudinaryId, name, size, postId }, txClient }: CreateFileProps) => {
  const dbClient = txClient || psqlPool;

  const file = await dbClient.query<Pick<FileCK, "id" | "url">>(
    `
        INSERT INTO files (
          url, cloudinary_id, name, size ${postId ? ", post_id" : ""}
        ) VALUES (
            $1, $2, $3, $4 ${postId ? ", $5" : ""}
        ) RETURNING id, url;
      `,
    [url, cloudinaryId, name, size, ...(postId ? [postId] : [])],
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
  txClient?: PoolClient;
};

export const deleteFile = async ({ id, txClient }: DeleteFileProps) => {
  const dbClient = txClient || psqlPool;
  const deletedFile = await dbClient.query<Pick<FileCK, "cloudinaryId">>(`
    DELETE FROM files WHERE id = $1 
    RETURNING cloudinary_id AS "cloudinaryId"`, [id]);
  return deletedFile.rows?.[0];
};


type GetFilesFromPostProps = {
  postId: number;
  excludedIds?: number[];
  txClient?: PoolClient;
};

export const getFilesFromPost = async ({ postId, excludedIds = [], txClient }: GetFilesFromPostProps) => {
  const dbClient = txClient || psqlPool;
  const params = [postId, ...(excludedIds.length ? [excludedIds] : [])];
  const files = await dbClient.query<Pick<FileCK, "id" | "cloudinaryId">>(`
      SELECT files.id, files.cloudinary_id
      FROM files 
      WHERE post_id = $1 ${!!excludedIds.length ? `AND id != ANY($2)` : ""}
    `, params);
  return files.rows;
};

type RemoveDeletedFilesFromPostProps = { currentPostFileIds: number[]; newFileIds: number[]; txClient?: PoolClient; };

export const removeDeletedFilesFromPost = async ({ currentPostFileIds, newFileIds, txClient }: RemoveDeletedFilesFromPostProps) => {
  const deletedFileIds = currentPostFileIds.filter((id) => !newFileIds.includes(id));
  if (!deletedFileIds.length) { return; }
  const dbClient = txClient || psqlPool;
  const { columnNamesIndexed, columnValues } = parseUpdateQueryDependencies({ data: { deletedFileIds } });
  const query = `
    DELETE FROM files 
    WHERE id = ANY (${columnNamesIndexed}) 
    RETURNING cloudinary_id AS "cloudinaryId";
  `;
  const cloudinaryIds = await dbClient.query<Pick<FileCK, "cloudinaryId">>(query, columnValues);
  return cloudinaryIds.rows;
};

type AssignFilesToPostProps = {
  data: { incomingFileIds: number[], currentPostfileIds: number[]; postId: number; };
  txClient?: PoolClient;
};

export const assignFilesToPost = async ({ data: { incomingFileIds, currentPostfileIds, postId }, txClient }: AssignFilesToPostProps) => {
  const newFileIds = incomingFileIds.filter((incFileId) => !currentPostfileIds.includes(incFileId));
  if (!newFileIds.length) { return; }
  const { columnNamesIndexed, columnValues } = parseUpdateQueryDependencies({ data: { newFileIds }, indexOffset: 1 });
  const query = `
    UPDATE files 
    SET post_id = $1 
    WHERE id = ANY (${columnNamesIndexed});
  `;
  const dbClient = txClient || psqlPool;
  await dbClient.query(query, [postId, columnValues]);

};

export const deleteCloudinaryFiles = async ({ ids }: { ids: string[]; }) => {
  if (!ids.length) { return; }
  const res = await cloudinaryClient.api.delete_resources(ids, { resource_type: "image" });
  return res;
};