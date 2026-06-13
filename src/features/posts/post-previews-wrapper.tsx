import { getPosts } from "@/lib/actions/post.actions";
import React from "react";
import PostPreview, { MainPostPreview } from "./post-preview";
import InfinitePostList from "@/features/posts/infinite-post-list";

export default async function PostPreviewsWrapper() {
  const { data } = await getPosts();
  if (!data) {
    // TOOD handle this
    return <div>No posts found.</div>;
  }
  const [firstPost, ...rest] = data;
  const initialCursor = rest[rest.length - 1].id;
  return (
    <div className="max-w-7xl px-4 flex flex-col mx-auto">
      <MainPostPreview data={firstPost} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,_minmax(0,1fr))] justify-items-center gap-10">
        {rest.map((post) => {
          return <PostPreview key={post.id} data={post} />;
        })}
        <InfinitePostList initialData={data} initialCursor={initialCursor} />
      </div>
    </div>
  );
}
