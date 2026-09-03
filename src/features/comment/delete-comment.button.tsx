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
      size="icon"
      variant="ghost"
      className={cn(
        "size-8 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-auto shrink-0",
        className,
      )}
      disabled={isPending}
      title="Delete comment"
      onClick={() => {
        startTransition(async () => {
          await handleDeleteComment({ postId, commentId });
        });
      }}
    >
      <Trash className="size-4" />
    </Button>
  );
}
