"use client";

import { Button } from "@/components/ui/button";
import { handleDeleteComment } from "@/lib/actions/comment.actions";
import { Trash } from "lucide-react";
import { useTransition } from "react";

type DeleteCommentButtonProps = {
  postId: number;
  commentId: number;
};

export default function DeleteCommentButton({ commentId, postId }: DeleteCommentButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          // TODO add toast?
          await handleDeleteComment({ postId, commentId });
        });
      }}
    >
      <Trash />
    </Button>
  );
}
