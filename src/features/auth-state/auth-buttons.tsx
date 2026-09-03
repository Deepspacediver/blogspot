import { Link } from "@/components/ui/link";
import React from "react";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/auth/signin"
        variant="ghost"
        size="sm"
        className="font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/10"
      >
        Sign in
      </Link>
      <Link
        href="/auth/signup"
        variant="secondary"
        size="sm"
        className="font-medium shadow-xs"
      >
        Sign up
      </Link>
    </div>
  );
}
