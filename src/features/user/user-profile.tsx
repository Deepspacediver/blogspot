import { UserCK, UserRole } from "@/db/types";
import React, { ReactNode } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

type UserProfileProps = {
  user: Pick<UserCK, "email" | "username" | "pictureUrl"> & {
    role?: UserRole;
  };
  className?: string;
  children?: ReactNode;
};

export default function UserProfile({ user, className, children }: UserProfileProps) {
  const { email, username, pictureUrl } = user;
  return (
    <div className={clsx("flex gap-1 items-center", className)}>
      <div className={clsx("rounded-full overflow-hidden shrink-0")}>
        {pictureUrl ? (
          <Image src={pictureUrl} width={24} height={24} alt="user picture" />
        ) : (
          <User className="size-10 p-1 shrink-" />
        )}
      </div>
      <div className="flex flex-col truncate">
        <p className="flex-1 truncate">{username || email}</p>
        {children}
      </div>
    </div>
  );
}
