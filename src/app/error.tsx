"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-6 py-20">
      <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-lg text-center backdrop-blur-sm flex flex-col items-center gap-6">
        <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while loading this page. You can try reloading or return to the home
            page.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground bg-secondary/5 rounded px-2 py-1 select-all inline-block mt-2">
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <Button
            variant="secondary"
            onClick={() => reset()}
            className="flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <RotateCcw className="size-4" />
            <span>Try again</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="size-4" />
              <span>Go Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
