import { getPostWithComments } from "@/lib/actions/post.actions";
import React from "react";
import Post from "@/features/posts/post";
import CommentSection from "@/features/comment/comment.section";
import { notFound } from "next/navigation";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = +id;
  const { data } = await getPostWithComments(parsedId);
  if (!data || !data.post) {
    notFound();
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
