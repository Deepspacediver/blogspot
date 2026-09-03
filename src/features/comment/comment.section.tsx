import { CommentWithAuthor } from "@/db/queries/post.queries";
import { getAppSessionData } from "@/lib/auth-dal";
import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import CommentForm from "@/features/comment/comment.form";
import CommentList from "./comment.list";

type CommentSectionProps = {
  data: CommentWithAuthor[];
  postId: number;
};

export default async function CommentSection({ data, postId }: CommentSectionProps) {
  const areCommentsEmpty = !data.length;
  const { user } = await getAppSessionData();

  return (
    <section className="h-full pt-12 border-t border-border/80">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Comments
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
          {data.length}
        </span>
      </div>

      {postId && user && <CommentForm postId={postId} />}

      {!user && (
        <div className="mb-8 p-5 rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground text-center sm:text-left">
            Have thoughts to share? Sign in to join the conversation.
          </p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs font-semibold shrink-0 transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}

      {areCommentsEmpty && (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/70 bg-card/30 flex flex-col items-center gap-2">
          <MessageSquare className="size-8 text-muted-foreground/50 mb-1" />
          <p className="text-foreground font-medium text-sm">No comments yet</p>
          <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}

      {!areCommentsEmpty && <CommentList postId={postId} data={data} />}
    </section>
  );
}
