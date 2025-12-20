import { type CommentWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import Comment from "@/features/comment/comment";

type CommentListProps = {
  data: CommentWithAuthor[];
  postId: number;
};

export default function CommentList({ data, postId }: CommentListProps) {
  return (
    <div>
      {data.map((comment) => (
        <Comment data={comment} key={comment.id} postId={postId} />
      ))}
    </div>
  );
}
