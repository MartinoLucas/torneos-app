"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField"; 
import { tournamentSchema, TournamentInput } from "@/lib/validations/tournament";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";
import { ChevronLeft, Trophy, CalendarIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NewTournamentPage() {
  const router = useRouter();

  const onSubmit = async (values: TournamentInput) => {
    try {
      const result: any = await tournamentService.createTournament(values);
      toast.success("Torneo creado en estado BORRADOR");
      router.push(`/admin/tournaments/${result.id}`);
    } catch (error) { 
        // El interceptor ya maneja el toast de error
        throw error; 
    }
  };

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl relative z-10"
        >
          {/* Botón Volver con estilo minimal */}
          <Link 
            href="/admin/tournaments" 
            className="inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors font-bold uppercase text-[10px] tracking-widest mb-6 group"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Volver al panel
          </Link>

          {/* Contenedor Efecto Vidrio */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20">
            
            {/* Header del Formulario */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="bg-zinc-950 p-4 rounded-2xl text-white mb-4 shadow-xl">
                <PlusCircle size={32} />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
                Nuevo <span className="text-primary">Torneo</span>
                <span className="text-zinc-400 block text-sm not-italic lowercase font-medium tracking-normal mt-2 max-w-sm">
                  Crea la base de tu evento. Luego podrás configurar las categorías y precios en el borrador.
                </span>
              </h1>
            </div>

            <FormTemplate
              title="" // Vaciamos para usar nuestro header personalizado
              description=""
              schema={tournamentSchema}
              defaultValues={{
                nombre: "",
                descripcion: "",
                fechaInicio: "",
                fechaFin: "",
                estado: "BORRADOR",
              }}
              onSubmit={onSubmit}
              submitText="Crear Borrador de Torneo"
            >
              {({ form }) => (
                <div className="space-y-6">
                  {/* Sección: Información General */}
                  <div className="space-y-4">
                    <TextField 
                        control={form.control} 
                        name="nombre" 
                        label="Nombre del Evento" 
                        placeholder="Ej: Open Verano 2026" 
                    />
                    <TextField 
                        control={form.control} 
                        name="descripcion" 
                        label="Descripción / Reglas" 
                        placeholder="Detalles sobre la competencia, locación o requisitos..." 
                    />
                  </div>

                  {/* Sección: Cronograma */}
                  <div className="pt-4 border-t border-zinc-200/50">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cronograma del Torneo</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField 
                        control={form.control} 
                        name="fechaInicio" 
                        label="Fecha de Inicio" 
                        type="date" 
                      />
                      <TextField 
                        control={form.control} 
                        name="fechaFin" 
                        label="Fecha de Finalización" 
                        type="date" 
                      />
                    </div>
                  </div>

                  {/* Nota informativa */}
                  <div className="bg-zinc-950/5 rounded-2xl p-4 border border-zinc-950/5 flex items-start gap-3">
                    <Trophy size={18} className="text-zinc-400 mt-0.5" />
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                        El torneo se creará como <strong className="text-zinc-900 uppercase">Borrador</strong>. 
                        No será visible para los participantes hasta que añadas al menos una competencia y lo publiques.
                    </p>
                  </div>
                </div>
              )}
            </FormTemplate>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}