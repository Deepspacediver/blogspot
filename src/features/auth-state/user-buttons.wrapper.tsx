import React from "react";
import UserProfile from "../user/user-profile";
import { AuthButtons } from "./auth-buttons";
import { getSessionData } from "@/lib/auth-dal";

export default async function UserButtonsWrapper() {
  const { user } = await getSessionData();
  return user ? <UserProfile user={user} /> : <AuthButtons />;
}
