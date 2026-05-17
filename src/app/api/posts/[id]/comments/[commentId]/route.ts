import { protectedAction } from "@/lib/session";
import { NextRequest } from "next/server";
import * as commentQueries from "@/db/queries/comment.queries";
import { APIResponse } from "@/lib/utils";
import { UserRole } from "@/db/types";

type CommentsParams = {
  params: Promise<{ id: string; commentId: string; }>;
};

export async function DELETE(req: NextRequest, { params }: CommentsParams) {
  return protectedAction(async ({ payload }) => {
    const { commentId, id } = await params;
    const parsedCommentId = +commentId;
    const parsedPostId = +id;
    const { authorId: postAuthorId, userId: commentAuthorId } = await commentQueries.getCommentPostAuthorId({
      commentId: parsedCommentId,
      postId: parsedPostId,
    });
    if ((commentAuthorId !== payload.userId && payload.role !== UserRole.SUPER_ADMIN) || (postAuthorId !== payload.userId && payload.role !== UserRole.SUPER_ADMIN)) {
      return APIResponse({
        data: {
          message: "You need to be a comment author or super admin to delete this comment",
        },
        status: 403
      });
    }
    await commentQueries.deleteComment({
      commentId: parsedCommentId,
      userId: payload.userId,
      canDeleteWithoutAuthorship: true,
    });

    return APIResponse({
      data: {
        message: "Successfully deleted a comment",
      },
      status: 200,
    });
  }, req);
}
