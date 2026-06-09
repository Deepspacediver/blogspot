import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-card/40 border-t border-border/50 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-sm text-muted-foreground">
        <p>
          Created by <span className="font-semibold text-foreground">deepspacediver</span> &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
