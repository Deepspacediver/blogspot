import CommentList from "@/features/comment/comment.list";
import UserProfile from "@/features/user/user-profile";
import { getPostWithComments } from "@/lib/actions/post.actions";
import { formatDateToAppConvention, formatDateToDateTimeAttribute } from "@/lib/utils";
import React from "react";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

// TODO this is only for rendering & testing
// this would be moved to seperate wrapper and loading state would be handled here
// additionaly content & shortDesciription would be rendered as html, not simple text
export default async function Page({ params }: PostPageProps) {
  const { id } = await params;
  const parsedId = +id;
  const { data } = await getPostWithComments(parsedId);

  if (!data || !data.post) {
    // TODO temporary
    return <div>Couldnt find a post</div>;
  }
  const { title, shortDescription, content, createdAt, username, email, pictureUrl } = data.post;
  const createdAtFormatted = formatDateToAppConvention(createdAt);
  const createdAtAttribute = formatDateToDateTimeAttribute(createdAt);
  return (
    <div>
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
          <time dateTime={createdAtAttribute}>{createdAtFormatted}</time>
        </header>
        <section>{shortDescription}</section>
        <section>{content}</section>
      </article>
      {/* TODO  Handle empty comments */}
      <CommentList data={data.comments} />
    </div>
  );
}
