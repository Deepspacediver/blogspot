"use client";

import { Button } from "@/components/ui/button";
import { defaultCreateCommentState } from "@/constants/form-states";
import { handleCreateComment } from "@/lib/actions/comment.actions";
import React, { useActionState } from "react";

type CommentFormProps = {
  postId: number;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const createCommentWithId = handleCreateComment.bind(null, postId);
  // TODO error handling
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_commentState, createCommentAction] = useActionState(createCommentWithId, defaultCreateCommentState);
  return (
    <form action={createCommentAction}>
      <label htmlFor="content">Content</label>
      <input type="content" name="content" />
      <Button>Submit</Button>
    </form>
  );
}
