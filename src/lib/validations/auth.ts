import { z } from "zod";

/**
 * Esquema para Login (Admin y Participante)
 * Basado en POST /admin/auth y POST /auth
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

/**
 * Esquema para Registro de Participante
 * Basado en POST /account
 */
export const registerSchema = loginSchema.extend({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  documentoTipo: z.string().min(1, "Seleccione un tipo de documento"),
  documentoNumero: z
    .string()
    .min(6, "Número de documento inválido")
    .regex(/^\d+$/, "Solo se permiten números"),
});

// Tipos inferidos para usar en TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;