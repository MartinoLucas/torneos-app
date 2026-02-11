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

/**
 * Esquema para Registro de Administrador
 * Basado en POST /admin/accounts
 * No requiere documento, pero sí email y password
 */
export const adminRegisterSchema = loginSchema.extend({
  email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

/**
 * Esquema para actualización de Administrador
 * Basado en PUT /admin/accounts/:id
 */
export const updateAdminSchema = z.object({
  email: z.string().email("Email inválido"),
  // Permitimos que sea opcional, pero si se escribe algo, debe tener 6 caracteres
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Solo validamos coincidencia si se ingresó algo en el campo password
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Tipos inferidos para usar en TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;