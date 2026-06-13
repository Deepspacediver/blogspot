"use client";
import { findPosts, FindPostsReturn } from "@/db/queries/post.queries";
import { useState, useTransition } from "react";
import PostPreview from "./post-preview";
import { Button } from "@/components/ui/button";
import { FETCH_LIMIT } from "@/constants/fetch-states";

type InfinitePostListProps = {
  initialCursor: number;
  initialData: FindPostsReturn[];
};

export default function InfinitePostList({ initialCursor, initialData }: InfinitePostListProps) {
  const [, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [canLoadMore, setCanLoadMore] = useState(initialData.length >= FETCH_LIMIT);
  const [cursor, setCursor] = useState(initialCursor);
  const [posts, setPosts] = useState<FindPostsReturn[]>([]);

  const loadMorePostsAction = async () => {
    setError(null);
    try {
      const newPosts = await findPosts({ cursor });
      if (!newPosts || newPosts.length <= FETCH_LIMIT) {
        setCanLoadMore(false);
      }
      const lastPostId = newPosts[newPosts.length - 1].id;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setCursor(lastPostId);
    } catch {
      setError("Failed to load more posts");
    }
  };

  return (
    <>
      {posts.map((post) => (
        <PostPreview key={post.id} data={post} />
      ))}
      {canLoadMore && (
        <div className="col-span-full w-full flex justify-center mt-6">
          <Button
            variant={"secondary"}
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await loadMorePostsAction();
              });
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
