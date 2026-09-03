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
      className="mb-8 rounded-2xl border border-border/80 bg-card p-4 flex flex-col gap-3 shadow-2xs focus-within:border-secondary/60 transition-colors"
      action={createCommentAction}
    >
      <Textarea
        className="min-h-[90px] border-0 bg-transparent p-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 resize-none shadow-none"
        id="content"
        name="content"
        placeholder="Write a response..."
      />
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <FormMessage messages={errors?.content} />
        <Button type="submit" size="sm" className="font-semibold px-4 ml-auto">
          Respond
        </Button>
      </div>
    </form>
  );
}
