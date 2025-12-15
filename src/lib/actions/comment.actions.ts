"use server";

import { defaultCreateCommentState } from "@/constants/form-states";
import { createComment } from "@/db/queries/comment.queries";
import { ActionState } from "@/db/types";
import * as commentModels from "@/models/comment.models";
import z from "zod";
import { getErrorDetails } from "../utils";
import { protectedAction } from "../session";
import { revalidatePath } from "next/cache";

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
