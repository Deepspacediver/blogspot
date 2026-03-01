// import cloudinary from "cloudinary";
import { protectedAction } from "@/lib/session";
import { NextRequest } from "next/server";
import { cloudinaryClient } from "@/config/cloudinary.config";
import * as fileQueries from "@/db/queries/file.queries";
import { APIResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  return protectedAction(async ({ body }) => {
    const file = (body as FormData)?.get("file") as File;

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

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
