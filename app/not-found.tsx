import Link from "next/link";
import { ChartBarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md text-center">
        <ChartBarIcon className="mx-auto h-24 w-24 text-muted-foreground mb-8" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          We could not find the financial resource you were looking for. It
          might have been moved or does not exist.
        </p>
        <Button asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
