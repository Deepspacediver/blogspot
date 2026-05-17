import psqlPool from "@/db";
import * as fileQueries from "@/db/queries/file.queries";
import * as postQueries from "@/db/queries/post.queries";
import { UserRole } from "@/db/types";
import { CustomError } from "@/errors/custom-error";
import { protectedAction } from "@/lib/session";
import { APIResponse } from "@/lib/utils";
import * as postModels from "@/models/post.models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return protectedAction(async () => {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || 0;
    const state = searchParams.get("state");
    const parsedData = postModels.findPostsSchema.safeParse({
      cursor,
      state,
    });
    if (!parsedData.success) {
      return APIResponse({
        data: {
          message: "Invalid request data",
        },
        status: 400,
      });
    }

    const posts = await postQueries.findPosts({
      cursor: parsedData.data.cursor,
      state: parsedData.data.state,
    });
    return APIResponse({
      data: posts,
    });
  }, req);
}

export async function POST(req: NextRequest) {
  return protectedAction(async ({ payload, body }) => {
    const parsedData = postModels.createPostSchema.safeParse(body);
    if (!parsedData.success) {
      return APIResponse({
        data: {
          message: "Invalid request data",
        },
        status: 400,
      });
    }

    if (payload.role === UserRole.USER) {
      return APIResponse({
        data: {
          message: "Forbidden",
        },
        status: 403,
      });
    }
    const { title, content, shortDescription, image, state, fileIds } = parsedData.data;
    const client = await psqlPool.connect();
    try {
      let headerImageId;
      client.query("BEGIN");
      if (image) {
        const { url, public_id, original_filename } = await fileQueries.uploadFileToCloudinary({ file: image });
        const { id } = await fileQueries.createFile({ data: { url, cloudinaryId: public_id, name: original_filename, size: image.size }, txClient: client });
        headerImageId = id;
      }
      const post = await postQueries.createPost({
        data: {
          authorId: payload.userId,
          title,
          content,
          headerImageId,
          shortDescription,
          state,
        },
        txClient: client
      });
      const mergedFileIds = headerImageId ? [...(fileIds || []), headerImageId] : fileIds || [];
      await fileQueries.assignFilesToPost({ data: { incomingFileIds: mergedFileIds, currentPostfileIds: [], postId: post.id }, txClient: client });
      await client.query('COMMIT');

      return APIResponse({
        data: {
          message: "Created",
        },
        status: 201,
      });
    } catch {
      await client.query("ROLLBACK");
      throw new CustomError("Failed to create post", 500);
    }
  }, req);
}
