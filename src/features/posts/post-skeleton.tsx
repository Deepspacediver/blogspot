import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function PostSkeleton() {
  return (
    <div>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <div className="space-y-3 mb-4">
            <Skeleton className="h-10 md:h-12 lg:h-14 w-11/12 bg-secondary/10" />
            <Skeleton className="h-10 md:h-12 lg:h-14 w-3/4 bg-secondary/10" />
          </div>

          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-full bg-secondary/10" />
            <Skeleton className="h-6 w-5/6 bg-secondary/10" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="size-12 rounded-full shrink-0 bg-secondary/10" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 bg-secondary/10" />
              <Skeleton className="h-3.5 w-24 bg-secondary/10" />
            </div>
          </div>

          <Separator />
        </header>

        <div className="space-y-6 mb-16">
          <Skeleton className="w-full h-72 sm:h-96 rounded-xl bg-secondary/10" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-secondary/10" />
            <Skeleton className="h-4 w-full bg-secondary/10" />
            <Skeleton className="h-4 w-4/5 bg-secondary/10" />
          </div>

          <Skeleton className="h-8 w-1/2 mt-8 mb-4 bg-secondary/10" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-secondary/10" />
            <Skeleton className="h-4 w-11/12 bg-secondary/10" />
            <Skeleton className="h-4 w-3/4 bg-secondary/10" />
          </div>
        </div>

        <section className="h-full pt-12 border-t border-border/80">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-32 bg-secondary/10" />
            <Skeleton className="h-6 w-8 rounded-full bg-secondary/10" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl mb-8 bg-secondary/10" />
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 md:p-5 rounded-2xl border border-border/80 bg-card gap-3 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full bg-secondary/15 shrink-0" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32 bg-secondary/10" />
                    <Skeleton className="h-3 w-16 bg-secondary/10" />
                  </div>
                </div>
                <div className="space-y-2 pl-0 sm:pl-12">
                  <Skeleton className="h-4 w-11/12 bg-secondary/10" />
                  <Skeleton className="h-4 w-3/4 bg-secondary/10" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
