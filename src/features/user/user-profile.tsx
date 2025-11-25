import { UserCK } from "@/db/types";
import React from "react";
import { User } from "lucide-react";

type UserProfileProps = {
  user: Pick<UserCK, "email" | "role" | "username">;
};

export default function UserProfile({ user }: UserProfileProps) {
  const { email, username } = user;
  return (
    <div>
      <User />
      <p>{username || email}</p>
    </div>
  );
}
