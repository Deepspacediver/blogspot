"use client";

import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/lib/actions/auth.actions";
import { Power } from "lucide-react";
import React, { useTransition } from "react";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      title="Sign out"
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
      onClick={() => {
        startTransition(async () => {
          await handleSignOut();
        });
      }}
    >
      <Power className="size-4" />
    </Button>
  );
}
