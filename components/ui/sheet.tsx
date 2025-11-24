"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!isMounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {children}
      </div>
    </>
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

export function SheetContent({
  className,
  children,
  onClose,
  ...props
}: SheetContentProps) {
  return (
    <div className={cn("flex flex-col h-full", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-accent transition-colors touch-manipulation"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
    </div>
  );
}

