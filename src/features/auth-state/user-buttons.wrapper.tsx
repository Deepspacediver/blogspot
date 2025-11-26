import React from "react";
import UserProfile from "../user/user-profile";
import { AuthButtons } from "./auth-buttons";
import { getAppSessionData } from "@/lib/auth-dal";

export default async function UserButtonsWrapper() {
  const { user } = await getAppSessionData();
  return user ? <UserProfile user={user} /> : <AuthButtons />;
}
