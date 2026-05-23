import { getPostWithComments } from "@/lib/actions/post.actions";
import React from "react";
import Post from "@/features/posts/post";
import CommentSection from "@/features/comment/comment.section";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

// TODO this is only for rendering & testing
// this would be moved to seperate wrapper and loading state would be handled here
// additionaly content would be rendered as html, not simple text
export default async function Page({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = +id;
  const { data } = await getPostWithComments(parsedId);
  if (!data || !data.post) {
    // TODO temporary add notFound
    return <div>Couldnt find a post</div>;
  }

  return (
    <div>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Post post={data.post} />
        <CommentSection data={data.comments} postId={parsedId} />
      </article>
    </div>
  );
}
