"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-primary text-foreground min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg text-center flex flex-col items-center gap-6">
          <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Critical Application Error
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A critical error occurred that prevented the application from loading. You can try refreshing the page or returning to the home page.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-muted-foreground bg-secondary/10 rounded px-2 py-1 select-all inline-block mt-2">
                ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button
              variant="secondary"
              onClick={() => reset()}
              className="flex items-center gap-2 justify-center w-full sm:w-auto cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Try again</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex items-center gap-2 justify-center w-full sm:w-auto cursor-pointer"
            >
              <Home className="size-4" />
              <span>Go Home</span>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
