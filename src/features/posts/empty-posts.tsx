import React from "react";
import { FileText } from "lucide-react";

export default function EmptyPosts() {
  return (
    <div className="max-w-xl mx-auto my-20 p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center">
      <div className="size-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
        <FileText className="size-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">No posts published yet</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Check back soon! New articles will appear here as soon as they are published.
      </p>
    </div>
  );
}
