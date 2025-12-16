import { CommentWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import UserProfile from "../user/user-profile";
import { getFormattedDateWithAttribute } from "@/lib/utils";
import DeleteCommentButton from "./delete-comment.button";
import { getAppSessionData } from "@/lib/auth-dal";
import { UserRole } from "@/db/types";

type CommentProps = {
  data: CommentWithAuthor;
  postId: number;
};

export default async function Comment({ data, postId }: CommentProps) {
  const { user } = await getAppSessionData();
  const { username, email, pictureUrl, createdAt, content, id } = data;
  const canDeleteComment = !!user && (user.userId === id || user.role === UserRole.ADMIN);

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
      {canDeleteComment && <DeleteCommentButton postId={postId} commentId={id} />}
    </div>
  );
}
