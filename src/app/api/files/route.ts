// import cloudinary from "cloudinary";
import { protectedAction } from "@/lib/session";
import { NextRequest } from "next/server";
import { cloudinaryClient } from "@/config/cloudinary.config";
import * as fileQueries from "@/db/queries/file.queries";
import { APIResponse, parseFileForUpload } from "@/lib/utils";
import { uploadFileSchema } from "@/models/file.models";

export async function POST(req: NextRequest) {
  return protectedAction(async ({ body }) => {
    const parsedData = uploadFileSchema.safeParse(body);
    if (!parsedData.success) {
      return APIResponse({
        status: 400,
        data: {
          message: "Invalid request data"
        }
      });
    }
    const { file } = parsedData.data;

    const { fileUri } = await parseFileForUpload({ file });

    const res = await cloudinaryClient.uploader.upload(fileUri, {
      filename_override: file.name,
      folder: "blogspot",
      use_filename: true,
    });
    const data = await fileQueries.createFile({
      url: res.url,
      cloudinaryId: res.public_id,
      name: res.original_filename,
      size: file.size,
    });

    return APIResponse({
      data,
      status: 201,
    });
  }, req);
}
