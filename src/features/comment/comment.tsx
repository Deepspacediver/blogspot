import { type CommentWithAuthor } from "@/db/queries/post.queries";
import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
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
  const { createdAt, content, id, userId, username, email, pictureUrl } = data;
  const canDeleteComment = !!user && (user.userId === userId || user.role === UserRole.SUPER_ADMIN);

  const { distanceDate, attributeDate } = getFormattedDateWithAttribute(createdAt);
  const displayName = username || email;

  return (
    <Card className="p-4 md:p-5 bg-card border border-border/80 rounded-2xl shadow-2xs gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-9 rounded-full overflow-hidden bg-secondary/15 text-secondary flex items-center justify-center border border-border/60 shrink-0">
            {pictureUrl ? (
              <Image src={pictureUrl} fill className="object-cover" alt={displayName} />
            ) : (
              <User className="size-4 text-secondary" />
            )}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-foreground text-sm truncate">
              {displayName}
            </span>
            <span className="text-muted-foreground/40 text-xs shrink-0">•</span>
            <time
              className="text-xs text-muted-foreground shrink-0"
              dateTime={attributeDate}
            >
              {distanceDate}
            </time>
          </div>
        </div>

        {canDeleteComment && <DeleteCommentButton postId={postId} commentId={id} />}
      </div>

      <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap pl-0 sm:pl-12">
        {content}
      </p>
    </Card>
  );
}
