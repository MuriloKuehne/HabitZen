"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff, Home } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            It looks like you&apos;re not connected to the internet. Please check your connection and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="min-h-[44px]"
          >
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="min-h-[44px]"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Some features may be limited while offline. Your data will sync when you&apos;re back online.
          </p>
        </div>
      </div>
    </div>
  );
}

