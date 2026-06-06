import { type FindPostsReturn } from "@/db/queries/post.queries";
import React from "react";
import PostPreview, { MainPostPreview } from "./post-preview";

type PostPreviewListProps = {
  data: FindPostsReturn[];
};
export default async function PostPreviewList({ data }: PostPreviewListProps) {
  const [firstPost, ...rest] = data;
  return (
    <div className="max-w-7xl px-4 flex flex-col mx-auto">
      <MainPostPreview data={firstPost} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,_minmax(0,1fr))] justify-items-center gap-10">
        {rest.map((post) => {
          return <PostPreview key={post.id} data={post} />;
        })}
      </div>
    </div>
  );
}
