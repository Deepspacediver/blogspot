import PostPreviewsWrapper from "@/features/posts/post-previews-wrapper";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<p>Loading...</p>}>
        <PostPreviewsWrapper />
      </Suspense>
    </div>
  );
}
