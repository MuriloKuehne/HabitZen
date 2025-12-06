"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HabitType } from "@/types/habit.types";

function ColorPicker({
  defaultColor,
  colors,
}: {
  defaultColor: string;
  colors: string[];
}) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap">
      {colors.map((color) => (
        <label
          key={color}
          className="cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          style={{
            width: "44px",
            height: "44px",
            minWidth: "44px",
            minHeight: "44px",
            borderRadius: "8px",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
              selectedColor === color
                ? "3px solid hsl(var(--foreground))"
                : "3px solid transparent",
          }}
        >
          <input
            type="radio"
            name="color"
            value={color}
            checked={selectedColor === color}
            onChange={() => setSelectedColor(color)}
            className="sr-only"
            required
          />
        </label>
      ))}
    </div>
  );
}

interface HabitFormProps {
  defaultValues?: {
    name: string;
    description: string;
    type: HabitType;
    color: string;
    weekly_frequency?: number;
  };
  onSubmit: (formData: FormData) => Promise<{ error?: string; details?: Record<string, string[]> } | void>;
  submitLabel?: string;
  error?: string;
  errorDetails?: Record<string, string[]>;
}

const colors = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function HabitForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Habit",
  error: initialError,
  errorDetails: initialErrorDetails,
}: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(initialError);
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]> | undefined>(initialErrorDetails);
  const [habitType, setHabitType] = useState<HabitType>(defaultValues?.type || "daily");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(undefined);
    setErrorDetails(undefined);

    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(formData);

    if (result?.error) {
      setError(result.error);
      setErrorDetails(result.details);
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">{defaultValues ? "Edit Habit" : "New Habit"}</CardTitle>
        <CardDescription className="text-sm">
          {defaultValues
            ? "Update your habit information"
            : "Create a new habit to track"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base sm:text-sm">Habit Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Exercise"
              required
              defaultValue={defaultValues?.name}
              autoComplete="off"
            />
            {errorDetails?.name && (
              <p className="text-sm text-red-500">{errorDetails.name.join(", ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base sm:text-sm">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="e.g., Do 30 minutes of exercise"
              defaultValue={defaultValues?.description || ""}
              autoComplete="off"
            />
            {errorDetails?.description && (
              <p className="text-sm text-red-500">{errorDetails.description.join(", ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-base sm:text-sm">Type</Label>
            <select
              id="type"
              name="type"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[44px] touch-manipulation"
              defaultValue={defaultValues?.type || "daily"}
              onChange={(e) => setHabitType(e.target.value as HabitType)}
              required
            >
              <option value="daily">Daily (+10 XP)</option>
              <option value="weekly">Weekly (+50 XP)</option>
            </select>
            {errorDetails?.type && (
              <p className="text-sm text-red-500">{errorDetails.type.join(", ")}</p>
            )}
          </div>

          {habitType === "weekly" ? (
            <div className="space-y-2">
              <Label htmlFor="weekly_frequency" className="text-base sm:text-sm">Weekly Frequency</Label>
              <Input
                id="weekly_frequency"
                name="weekly_frequency"
                type="number"
                inputMode="numeric"
                min="1"
                max="100"
                placeholder="e.g., 3"
                required={habitType === "weekly"}
                defaultValue={defaultValues?.weekly_frequency || 1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How many times do you want to complete this habit per week? (1-100)
              </p>
              {errorDetails?.weekly_frequency && (
                <p className="text-sm text-red-500">{errorDetails.weekly_frequency.join(", ")}</p>
              )}
            </div>
          ) : (
            <input type="hidden" name="weekly_frequency" value="" />
          )}

          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker
              defaultColor={defaultValues?.color || "#3b82f6"}
              colors={colors}
            />
            {errorDetails?.color && (
              <p className="text-sm text-red-500">{errorDetails.color.join(", ")}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

