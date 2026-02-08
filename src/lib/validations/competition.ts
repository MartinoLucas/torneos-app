import { z } from "zod";

export const competenciaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  cupo: z.coerce.number().int().min(1, "El cupo debe ser al menos 1"),
});

export type CompetenciaInput = z.infer<typeof competenciaSchema>;