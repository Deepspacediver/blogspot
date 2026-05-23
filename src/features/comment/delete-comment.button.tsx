"use client";

import { Button } from "@/components/ui/button";
import { handleDeleteComment } from "@/lib/actions/comment.actions";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useTransition } from "react";

type DeleteCommentButtonProps = {
  postId: number;
  commentId: number;
  className?: string;
};

export default function DeleteCommentButton({ commentId, postId, className }: DeleteCommentButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      size={"icon"}
      className={cn("ml-auto", className)}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await handleDeleteComment({ postId, commentId });
        });
      }}
    >
      <Trash />
    </Button>
  );
}
