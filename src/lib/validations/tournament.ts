import { z } from "zod";

export const tournamentSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fechaFin: z.string().min(1, "La fecha de finalización es obligatoria"),
  estado: z.enum(["BORRADOR", "PUBLICADO", "FINALIZADO"]).default("BORRADOR"),
}).refine((data) => new Date(data.fechaFin) >= new Date(data.fechaInicio), {
  message: "La fecha de fin no puede ser anterior a la de inicio",
  path: ["fechaFin"],
});

export type TournamentInput = z.infer<typeof tournamentSchema>;