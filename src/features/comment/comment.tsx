import { type CommentWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import UserProfile from "../user/user-profile";
import { getFormattedDateWithAttribute } from "@/lib/utils";
import DeleteCommentButton from "./delete-comment.button";
import { getAppSessionData } from "@/lib/auth-dal";
import { UserRole } from "@/db/types";
import { Card } from "@/components/ui/card";

type CommentProps = {
  data: CommentWithAuthor;
  postId: number;
};

export default async function Comment({ data, postId }: CommentProps) {
  const { user } = await getAppSessionData();
  const { createdAt, content, id, ...commentAuthor } = data;
  const canDeleteComment = !!user && (user.userId === id || user.role === UserRole.SUPER_ADMIN);

  const { distanceDate, attributeDate } = getFormattedDateWithAttribute(createdAt);
  return (
    <Card className="gap-2 p-2 shadow-none border-0 rounded-none last:rounded-b-2xl ">
      <div className="flex items-center gap-2 flex-nowrap">
        <UserProfile className="md:gap-4 min-w-0" user={commentAuthor} />
        <time
          className="text-xs text-zinc-400/85 inline-block whitespace-nowrap shrink-0"
          dateTime={attributeDate}
        >
          {distanceDate}
        </time>
        {canDeleteComment && <DeleteCommentButton postId={postId} commentId={id} />}
      </div>
      <p className="pl-11 md:pl-14">{content}</p>
    </Card>
  );
}
