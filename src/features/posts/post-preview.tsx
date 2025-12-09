import { FindPostsReturn } from "@/db/queries/post.queries";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserProfile from "../user/user-profile";

const DEFAULT_POST_IMAGE_URL =
  "https://img.freepik.com/free-vector/cute-bee-flying-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector_138676-6016.jpg?t=st=1765216630~exp=1765220230~hmac=ef55c716ffcd7870cf8931dfaf2036ec395508f47fa069b5b59a93182a90ec3d&w=1480";

type PostPreviewProps = {
  data: FindPostsReturn;
};

export default function PostPreview({ data }: PostPreviewProps) {
  const { id, title, image, createdAt, email: authorEmail, username, pictureUrl: authorPicture } = data;
  const createdAtFormatted = format(new Date(createdAt), "MMMM d, yyyy");
  const createdAtAttribute = format(new Date(createdAt), "yyyy-MM-dd kk:mm:ss");
  return (
    <Link className="w-96 h-96 block" href={`/posts/${id}`}>
      <article>
        <Image src={image || DEFAULT_POST_IMAGE_URL} alt="post article" width={200} height={180} />
        <div>
          <time dateTime={createdAtAttribute}>{createdAtFormatted}</time>
          <h2>{title}</h2>
        </div>
        <div>
          <UserProfile
            user={{
              username,
              email: authorEmail,
              pictureUrl: authorPicture,
            }}
          />
        </div>
      </article>
    </Link>
  );
}
