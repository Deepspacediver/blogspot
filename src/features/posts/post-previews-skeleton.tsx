import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MainPostPreviewSkeleton() {
  return (
    <div className="block w-full my-10">
      <Card className="flex flex-col md:flex-row bg-card border border-border/80 rounded-2xl p-6 gap-6">
        <div className="flex-2/3 rounded-xl overflow-hidden">
          <Skeleton className="w-full min-h-[400px] max-h-[500px] h-full rounded-xl bg-secondary/10" />
        </div>
        <div className="flex flex-col text-sm flex-1/3 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 bg-secondary/10" />
              <Skeleton className="h-4 w-28 bg-secondary/10" />
            </div>
            <Skeleton className="h-9 w-4/5 bg-secondary/10" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full bg-secondary/10" />
              <Skeleton className="h-4 w-11/12 bg-secondary/10" />
              <Skeleton className="h-4 w-4/5 bg-secondary/10" />
            </div>
          </div>
          <Skeleton className="h-9 min-w-32 w-fit ml-auto mt-6 rounded-md bg-secondary/10" />
        </div>
      </Card>
    </div>
  );
}

export function PostPreviewSkeleton() {
  return (
    <div className="block w-full">
      <Card className="flex flex-col bg-card border border-border/80 rounded-2xl p-4 gap-4 h-full">
        <div className="rounded-xl overflow-hidden h-64 w-full">
          <Skeleton className="w-full h-full rounded-xl bg-secondary/10" />
        </div>
        <div className="flex flex-col gap-3 px-1 flex-grow">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 bg-secondary/10" />
            <Skeleton className="h-4 w-24 bg-secondary/10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full bg-secondary/10" />
            <Skeleton className="h-6 w-3/4 bg-secondary/10" />
          </div>
        </div>
        <Skeleton className="h-9 min-w-32 w-fit ml-auto mt-auto rounded-md bg-secondary/10" />
      </Card>
    </div>
  );
}

export default function PostPreviewsSkeleton() {
  return (
    <div className="max-w-7xl px-4 flex flex-col mx-auto">
      <MainPostPreviewSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,_minmax(0,1fr))] justify-items-center gap-10 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostPreviewSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
