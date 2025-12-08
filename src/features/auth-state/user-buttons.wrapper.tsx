import React from "react";
import UserProfile from "../user/user-profile";
import { AuthButtons } from "./auth-buttons";
import { getAppSessionData } from "@/lib/auth-dal";
import SignOutButton from "@/components/sign-out.button";

export default async function UserButtonsWrapper() {
  const { user } = await getAppSessionData();
  return user ? (
    <div className="flex gap-1">
      <UserProfile user={user} />
      <SignOutButton />
    </div>
  ) : (
    <AuthButtons />
  );
}
