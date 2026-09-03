import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface PageLoaderProps extends React.ComponentProps<"div"> {
  text?: string;
}

export default function PageLoader({ className, text = "Loading...", ...props }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[50vh] py-16 gap-3 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Spinner className="size-8 text-foreground/70" />
      {text ? <p className="text-sm font-medium tracking-wide animate-pulse">{text}</p> : null}
    </div>
  );
}
