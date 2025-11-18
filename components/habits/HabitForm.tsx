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
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <label
          key={color}
          className="cursor-pointer"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
              selectedColor === color
                ? "3px solid #000"
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
  submitLabel = "Criar Hábito",
  error: initialError,
  errorDetails: initialErrorDetails,
}: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(initialError);
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]> | undefined>(initialErrorDetails);

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
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? "Editar Hábito" : "Novo Hábito"}</CardTitle>
        <CardDescription>
          {defaultValues
            ? "Atualize as informações do seu hábito"
            : "Crie um novo hábito para rastrear"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Hábito</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Exercitar-se"
              required
              defaultValue={defaultValues?.name}
            />
            {errorDetails?.name && (
              <p className="text-sm text-red-500">{errorDetails.name.join(", ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ex: Fazer 30 minutos de exercício"
              defaultValue={defaultValues?.description || ""}
            />
            {errorDetails?.description && (
              <p className="text-sm text-red-500">{errorDetails.description.join(", ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue={defaultValues?.type || "daily"}
              required
            >
              <option value="daily">Diário (+10 XP)</option>
              <option value="weekly">Semanal (+50 XP)</option>
            </select>
            {errorDetails?.type && (
              <p className="text-sm text-red-500">{errorDetails.type.join(", ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

