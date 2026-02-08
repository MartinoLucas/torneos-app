"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField"; 
import { tournamentSchema, TournamentInput } from "@/lib/validations/tournament";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewTournamentPage() {
  const router = useRouter();

  const onSubmit = async (values: TournamentInput) => {
    try {
      const result: any = await tournamentService.createTournament(values);
      toast.success("Torneo creado en estado BORRADOR");
      router.push(`/admin/tournaments/${result.id}`);
    } catch (error) { throw error; }
  };

  return (
    <PageWrapper>
      <div className="container max-w-2xl mx-auto py-10">
        <Button variant="ghost" asChild className="pl-0 mb-6 hover:bg-transparent">
          <Link href="/admin/tournaments" className="flex items-center text-zinc-500 hover:text-zinc-900">
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver
          </Link>
        </Button>

        <FormTemplate
          title="Nuevo Torneo"
          description="Al crear el torneo, quedará en estado BORRADOR para que puedas cargar las competencias."
          schema={tournamentSchema}
          defaultValues={{
            nombre: "",
            descripcion: "",
            fechaInicio: "",
            fechaFin: "",
            estado: "BORRADOR",
          }}
          onSubmit={onSubmit}
        >
          {({ form }) => (
            <div className="space-y-4">
              <TextField control={form.control} name="nombre" label="Nombre" placeholder="Ej: Open Verano" />
              <TextField control={form.control} name="descripcion" label="Descripción" placeholder="Acerca de este torneo..." />
              <div className="grid grid-cols-2 gap-4">
                <TextField control={form.control} name="fechaInicio" label="Inicio" type="date" />
                <TextField control={form.control} name="fechaFin" label="Fin" type="date" />
              </div>
            </div>
          )}
        </FormTemplate>
      </div>
    </PageWrapper>
  );
}