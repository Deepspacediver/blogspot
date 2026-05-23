import { CommentWithAuthor } from "@/db/queries/post.queries";
import { getAppSessionData } from "@/lib/auth-dal";
import React from "react";
import CommentForm from "@/features/comment/comment.form";
import Comment from "@/features/comment/comment";

type CommentSectionProps = {
  data: CommentWithAuthor[];
  postId: number;
};

export default async function CommentSection({ data, postId }: CommentSectionProps) {
  const areCommentsEmpty = !data.length;
  const { user } = await getAppSessionData();

  return (
    <section className="h-full">
      <h2>Comments</h2>
      {postId && user && <CommentForm postId={postId} />}
      {areCommentsEmpty && <p>No comments yet.</p>}
      {!areCommentsEmpty &&
        data.map((comment) => <Comment postId={postId} key={comment.id} data={comment} />)}
    </section>
  );
}
