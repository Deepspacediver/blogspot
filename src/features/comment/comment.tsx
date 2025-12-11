import { CommentsWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import UserProfile from "../user/user-profile";
import { getFormattedDateWithAttribute } from "@/lib/utils";

type CommentProps = {
  data: CommentsWithAuthor;
};

export default function Comment({ data }: CommentProps) {
  const { username, email, pictureUrl, createdAt, content } = data;
  const { formattedDate, attributeDate } = getFormattedDateWithAttribute(createdAt);
  return (
    <div>
      <div className="flex ">
        <UserProfile
          user={{
            username,
            email,
            pictureUrl,
          }}
        />
        <p>{content}</p>
      </div>
      <time dateTime={attributeDate}>{formattedDate}</time>
    </div>
  );
}
