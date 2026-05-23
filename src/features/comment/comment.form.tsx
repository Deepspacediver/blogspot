"use client";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { defaultCreateCommentState } from "@/constants/form-states";
import { handleCreateComment } from "@/lib/actions/comment.actions";
import React, { useActionState } from "react";

type CommentFormProps = {
  postId: number;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const createCommentWithId = handleCreateComment.bind(null, postId);
  const [commentState, createCommentAction] = useActionState(createCommentWithId, defaultCreateCommentState);
  const errors = commentState.fieldErrors;
  return (
    <form
      className="relative bg-white rounded-t-xl overflow-hidden flex flex-col mt-6"
      action={createCommentAction}
    >
      <Textarea
        className="block bg-white rounded-none border-0 focus-visible:ring-0 resize-none"
        id="content"
        name="content"
        placeholder="Write a response..."
      />
      <Separator className="bg-border/60" />
      <div className="flex justify-between p-1.5 bg-muted/10">
        <FormMessage messages={errors?.content} />
        <Button type="submit" size="sm" className="font-semibold px-4 ml-auto">
          Submit
        </Button>
      </div>
    </form>
  );
}
