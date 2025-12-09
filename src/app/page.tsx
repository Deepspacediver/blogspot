import PostPreviewList from "@/features/posts/post-preview-list";
import { getPosts } from "@/lib/actions/post.actions";

export default async function Home() {
  const { data } = await getPosts();

  return <div className="min-h-screen">{!!data?.length && <PostPreviewList data={data} />}</div>;
}
