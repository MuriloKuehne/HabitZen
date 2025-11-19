"use client";

import { cn } from "@/lib/utils";

interface LevelProgressBarProps {
  progress: number;
  className?: string;
}

export function LevelProgressBar({ progress, className }: LevelProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progresso para próximo nível</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out animate-in slide-in-from-left"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

