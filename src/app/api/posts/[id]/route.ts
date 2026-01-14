import { protectedAction } from "@/lib/session";
import { NextRequest } from "next/server";
import * as postQueries from "@/db/queries/post.queries";
import { APIResponse } from "@/lib/utils";
import * as postModels from "@/models/post.models";
import { UserRole } from "@/db/types";

type PostParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: PostParams) {
  return protectedAction(async () => {
    const { id } = await params;
    const parsedId = +id;
    const post = postQueries.findPost({ id: parsedId, isOnlyPublished: false });
    if (!post) {
      return APIResponse({
        data: {
          message: "Could not find a post",
        },
        status: 404,
      });
    }
    const comments = postQueries.findCommentsForPost({
      id: parsedId,
    });

    return APIResponse({
      data: {
        ...post,
        comments,
      },
      status: 200,
    });
  }, req);
}

export async function PATCH(req: NextRequest, { params }: PostParams) {
  return protectedAction(async ({ body }) => {
    const { id } = await params;
    const parsedId = +id;
    const parsedData = postModels.updatePostSchema.safeParse(body);
    if (!parsedData.success) {
      return APIResponse({
        data: {
          message: "Invalid request data",
        },
        status: 400,
      });
    }

    await postQueries.updatePost({
      id: parsedId,
      ...parsedData.data,
    });

    return APIResponse({
      data: {
        message: "Updated post successfully",
      },
      status: 200,
    });
  }, req);
}

export async function DELETE(req: NextRequest, { params }: PostParams) {
  return protectedAction(async ({ payload }) => {
    const { id } = await params;
    const parsedId = +id;
    const isSuperAdmin = payload.role === UserRole.SUPER_ADMIN;
    const canDeletePost = isSuperAdmin ? true : (await postQueries.findPost({ id: parsedId }))?.authorId === payload.userId;
    if (!canDeletePost) {
      return APIResponse({
        data: {
          message: "Cannot delete someone else's post",
        },
        status: 403,
      });
    }

    await postQueries.deletePost({ id: parsedId });

    return APIResponse({
      data: {
        message: "Successfully deleted a post",
      },
      status: 204,
    });
  }, req);
}
