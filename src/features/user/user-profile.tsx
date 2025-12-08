import { UserCK, UserRole } from "@/db/types";
import React from "react";
import { User } from "lucide-react";
import Image from "next/image";

type UserProfileProps = {
  user: Pick<UserCK, "email" | "username" | "pictureUrl"> & {
    role?: UserRole;
  };
};

export default function UserProfile({ user }: UserProfileProps) {
  const { email, username, pictureUrl } = user;
  return (
    <div className="flex gap-1">
      {pictureUrl ? <Image src={pictureUrl} width={24} height={24} alt="user picture" /> : <User className="size-6" />}
      <p>{username || email}</p>
    </div>
  );
}
