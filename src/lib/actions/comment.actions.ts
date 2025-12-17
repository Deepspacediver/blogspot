"use server";

import { defaultCreateCommentState } from "@/constants/form-states";
import { createComment, deleteComment } from "@/db/queries/comment.queries";
import { ActionState, UserRole } from "@/db/types";
import * as commentModels from "@/models/comment.models";
import z from "zod";
import { getErrorDetails } from "../utils";
import { protectedAction } from "../session";
import { revalidatePath } from "next/cache";
import { CustomError } from "@/errors/custom-error";

export type CreateCommentFields = {
  content: string | null;
};

export type CreateCommentState = ActionState<CreateCommentFields>;

export const handleCreateComment = async (
  postId: number,
  prevState: CreateCommentState,
  data?: FormData,
): Promise<CreateCommentState> => {
  return await protectedAction(async ({ payload }) => {
    if (!data) {
      return {
        ...defaultCreateCommentState,
        message: "Missing form data",
        prevFormState: prevState.prevFormState,
      };
    }

    const formData = {
      postId,
      userId: payload.userId,
      content: data.get("content") as string | null,
    };
    const parsedData = commentModels.createCommentSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        ...defaultCreateCommentState,
        fieldErrors: z.flattenError(parsedData.error).fieldErrors,
        message: "Incorrect comment data",
        prevFormState: formData,
      };
    }
    try {
      await createComment({ postId, userId: formData.userId, content: parsedData.data.content });
      revalidatePath(`/posts/${postId}`);
      return {
        ...defaultCreateCommentState,
      };
    } catch (error) {
      const details = getErrorDetails({ error });
      return {
        ...defaultCreateCommentState,
        message: "Failed to create a comment.",
        prevFormState: formData,
        error,
        details,
      };
    }
  });
};

type HandleDeleteCommentProps = {
  commentId: number;
  postId: number;
};
export const handleDeleteComment = async ({ commentId, postId }: HandleDeleteCommentProps) => {
  return await protectedAction(async ({ payload }) => {
    const parsedData = commentModels.deleteCommentSchema.safeParse({
      commentId,
      userId: payload.userId,
    });

    if (!parsedData.success) {
      return {
        error: new CustomError("Missing data for successful request.", 400),
        message: "Failed to delete comment",
      };
    }

    const { userId } = parsedData.data;
    try {
      await deleteComment({ userId, commentId, isSuperAdmin: payload.role === UserRole.SUPER_ADMIN });
      revalidatePath(`/posts/${postId}`);
      return {
        error: null,
        details: "",
        message: "",
      };
    } catch (error) {
      const details = getErrorDetails({ error });
      return {
        error,
        details,
        message: "Failed to delete a comment.",
      };
    }
  });
};
