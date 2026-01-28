"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isBefore, isAfter, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Tournament } from "../services/tournament-service";
import Link from "next/link";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  // Lógica de validación de estado
  const now = new Date();
  const start = parseISO(tournament.fechaInicio);
  const end = parseISO(tournament.fechaFin);
  
  const isUpcoming = isBefore(now, start);
  const isFinished = isAfter(now, end);
  const isOpen = !isUpcoming && !isFinished;

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
            {isOpen ? (
              <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">
                Inscripción Abierta
              </span>
            ) : isUpcoming ? (
              <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full uppercase tracking-wider">
                Próximamente
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-1 bg-zinc-100 text-zinc-500 rounded-full uppercase tracking-wider">
                Finalizado
              </span>
            )}
          </div>
          <CardTitle className="mt-4 line-clamp-1">{tournament.nombre}</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
            {tournament.descripcion || "Sin descripción disponible."}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-zinc-500 gap-2">
              <Calendar size={14} className="text-primary" />
              <span>Inicia: {format(start, "d 'de' MMM", { locale: es })}</span>
            </div>
            {!isOpen && isUpcoming && (
              <div className="flex items-center text-[10px] text-amber-600 gap-1 font-medium">
                <Clock size={12} />
                <span>Abre pronto</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-zinc-50 pt-4">
          <Button variant="ghost" className="w-full group" asChild>
            <Link href={`/tournaments/${tournament.id}`}>
              {isOpen ? "Inscribirme" : "Ver detalles"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}