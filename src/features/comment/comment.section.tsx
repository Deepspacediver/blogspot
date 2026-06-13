import { CommentWithAuthor } from "@/db/queries/post.queries";
import { getAppSessionData } from "@/lib/auth-dal";
import React from "react";
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
    <section className="h-full">
      <h2>Comments</h2>
      {postId && user && <CommentForm postId={postId} />}
      {areCommentsEmpty && <div className="mx-auto w-fit p-2">No comments yet.</div>}
      {!areCommentsEmpty && <CommentList postId={postId} data={data} />}
    </section>
  );
}
