import * as postQueries from "@/db/queries/post.queries";
import { UserRole } from "@/db/types";
import { protectedAction } from "@/lib/session";
import { APIResponse } from "@/lib/utils";
import * as postModels from "@/models/post.models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return protectedAction(async ({ }) => {
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

    const { title, content, shortDescription, headerImageId, state } = parsedData.data;
    await postQueries.createPost({
      authorId: payload.userId,
      title,
      content,
      headerImageId,
      shortDescription,
      state,
    });

    return APIResponse({
      data: {
        message: "Created",
      },
      status: 201,
    });
  }, req);
}
