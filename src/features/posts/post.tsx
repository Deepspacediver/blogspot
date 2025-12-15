import { PostWithAuthorReturn } from "@/db/queries/post.queries";
import React from "react";
import UserProfile from "../user/user-profile";
import { getFormattedDateWithAttribute } from "@/lib/utils";

type PostProps = {
  post: PostWithAuthorReturn;
};

export default async function Post({ post }: PostProps) {
  const { title, shortDescription, content, createdAt, username, email, pictureUrl } = post;
  const { attributeDate, formattedDate } = getFormattedDateWithAttribute(createdAt);
  return (
    <article>
      <header>
        <h1>{title}</h1>
        <UserProfile
          user={{
            email,
            username,
            pictureUrl,
          }}
        />
        <time dateTime={attributeDate}>{formattedDate}</time>
      </header>
      <section>{shortDescription}</section>
      <section>{content}</section>
    </article>
  );
}
