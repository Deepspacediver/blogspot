import { protectedAction } from "@/lib/session";
import { NextRequest } from "next/server";
import * as postQueries from "@/db/queries/post.queries";
import { APIResponse } from "@/lib/utils";
import * as postModels from "@/models/post.models";
import { PostState, UserRole } from "@/db/types";
import { createFile, deleteFile, uploadFileToCloudinary } from "@/db/queries/file.queries";

type PostParams = { params: Promise<{ id: string; }>; };

export async function GET(req: NextRequest, { params }: PostParams) {
  return protectedAction(async () => {
    const { id } = await params;
    const parsedId = +id;
    const state = req.nextUrl.searchParams.get("state") as PostState;
    const post = await postQueries.findPost({ id: parsedId, state });
    if (!post) {
      return APIResponse({
        data: {
          message: "Could not find a post",
        },
        status: 404,
      });
    }
    const comments = await postQueries.findCommentsForPost({
      id: parsedId,
    });

    return APIResponse({
      data: {
        ...post,
        comments: comments || [],
      },
      status: 200,
    });
  }, req);
}

export async function PATCH(req: NextRequest, { params }: PostParams) {
  return protectedAction(async ({ body }) => {
    const { id } = await params;
    const parsedData = postModels.updatePostSchema.safeParse({ ...body, id });
    if (!parsedData.success) {
      return APIResponse({
        data: {
          message: "Invalid request data",
        },
        status: 400,
      });
    }

    const existingPost = await postQueries.findPost({ id: parsedData.data.id });
    if (!existingPost) {
      return APIResponse({
        status: 404,
        data: {
          message: "Could not find a post",
        },
      });
    }

    let headerImageId;
    if (parsedData.data.image) {
      const { url, public_id, original_filename, size } = await uploadFileToCloudinary({ file: parsedData.data.image });
      const { id } = await createFile({ url, cloudinaryId: public_id, name: original_filename, size });
      headerImageId = id;
      if (existingPost.headerImageId) {
        await deleteFile({ id: existingPost.headerImageId });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _, ...rest } = parsedData.data;
    await postQueries.updatePost({
      ...rest,
      headerImageId,
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
