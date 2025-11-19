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
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
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
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-accent transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

