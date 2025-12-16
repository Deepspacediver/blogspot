import CommentForm from "@/features/comment/comment.form";
import { getPostWithComments } from "@/lib/actions/post.actions";
import CommentList from "@/features/comment/comment.list";
import React from "react";
import { getAppSessionData } from "@/lib/auth-dal";
import Post from "@/features/posts/post";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

// TODO this is only for rendering & testing
// this would be moved to seperate wrapper and loading state would be handled here
// additionaly content & shortDesciription would be rendered as html, not simple text
export default async function Page({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = +id;
  const { user } = await getAppSessionData();
  const { data } = await getPostWithComments(parsedId);

  if (!data || !data.post) {
    // TODO temporary add notFound
    return <div>Couldnt find a post</div>;
  }

  return (
    <div>
      <div>
        <Post post={data.post} />
        {/* TODO  Handle empty comments */}
        <CommentList postId={parsedId} data={data.comments} />
      </div>
      {parsedId && user && <CommentForm postId={parsedId} />}
    </div>
  );
}
