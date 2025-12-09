import { FindPostsReturn } from "@/db/queries/post.queries";
import React from "react";
import PostPreview from "./post-preview";

type PostPreviewListProps = {
  data: FindPostsReturn[];
};

export default function PostPreviewList({ data }: PostPreviewListProps) {
  return data.map((post) => <PostPreview key={post.id} data={post} />);
}
