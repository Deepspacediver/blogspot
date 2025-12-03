"use client";

import { UserCK } from "@/db/types";
import React from "react";
import { Power, User } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth.actions";

type UserProfileProps = {
  user: Pick<UserCK, "email" | "role" | "username">;
};

export default function UserProfile({ user }: UserProfileProps) {
  const { email, username } = user;
  return (
    <div className="flex gap-1">
      <User />
      <p>{username || email}</p>
      <Power onClick={async () => await handleSignOut()} />
    </div>
  );
}
