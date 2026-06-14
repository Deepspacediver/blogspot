import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center p-6 py-20">
      <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-lg text-center backdrop-blur-sm flex flex-col items-center gap-6">
        <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">404 - Page Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The resource you were searching for has not been found.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
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
