import { CommentsWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import Comment from "@/features/comment/comment";

type CommentListProps = {
  data: CommentsWithAuthor[];
};

export default function CommentList({ data }: CommentListProps) {
  return (
    <div>
      {data.map((comment) => (
        <Comment data={comment} key={comment.id} />
      ))}
    </div>
  );
}
