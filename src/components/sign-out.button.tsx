"use client";
import { handleSignOut } from "@/lib/actions/auth.actions";
import { Power } from "lucide-react";
import React from "react";

export default function SignOutButton() {
  return <Power className="size-5" onClick={async () => await handleSignOut()} />;
}
