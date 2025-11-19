import { z } from "zod";

export const habitSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    type: z.enum(["daily", "weekly"], {
      required_error: "Type is required",
    }),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color").default("#3b82f6"),
    weekly_frequency: z
      .number()
      .int("Frequency must be an integer")
      .min(1, "Frequency must be at least 1")
      .max(100, "Frequency must be at most 100")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "weekly") {
        return data.weekly_frequency !== undefined && data.weekly_frequency !== null;
      }
      return true;
    },
    {
      message: "Weekly frequency is required for weekly habits",
      path: ["weekly_frequency"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "daily") {
        return data.weekly_frequency === undefined || data.weekly_frequency === null;
      }
      return true;
    },
    {
      message: "Weekly frequency should not be set for daily habits",
      path: ["weekly_frequency"],
    }
  );

export const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type HabitFormData = z.infer<typeof habitSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

