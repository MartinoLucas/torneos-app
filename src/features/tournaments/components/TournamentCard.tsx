"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TournamentCard({ tournament }: { tournament: any }) {
  const now = new Date();
  const start = parseISO(tournament.fechaInicio);
  const canRegister = tournament.estado === "PUBLICADO" && isBefore(now, start);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-zinc-50/50 pb-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white rounded-lg border border-zinc-100 shadow-sm text-primary">
              <Trophy size={20} />
            </div>
            
            {/* Badge Dinámico */}
            {canRegister ? (
              <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">
                Inscripción Abierta
              </span>
            ) : tournament.estado === "FINALIZADO" ? (
              <span className="text-[10px] font-bold px-2 py-1 bg-zinc-100 text-zinc-500 rounded-full uppercase tracking-wider">
                Finalizado
              </span>
            ) :(
              <span className="text-[10px] font-bold px-2 py-1 bg-zinc-100 text-zinc-500 rounded-full uppercase tracking-wider">
                Inscripción Cerrada
              </span>
            )}
          </div>
          <CardTitle className="mt-4 line-clamp-1">{tournament.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-32">
          <CardTitle className="mb-2">{tournament.nombre}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{tournament.descripcion}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <Calendar size={14} className="text-primary" />
            <span>Inicia: {format(start, "d 'de' MMM", { locale: es })}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="ghost" className="w-full group" asChild>
            <Link href={`/tournaments/${tournament.id}`}>
              {canRegister ? "Inscribirme" : "Ver detalles"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}