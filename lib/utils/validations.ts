import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  type: z.enum(["daily", "weekly"], {
    required_error: "Tipo é obrigatório",
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida").default("#3b82f6"),
});

export const signUpSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type HabitFormData = z.infer<typeof habitSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

