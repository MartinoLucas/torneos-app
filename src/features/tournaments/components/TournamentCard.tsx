"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isBefore, isAfter, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TournamentCard({ tournament }: { tournament: any }) {
  const now = new Date();
  const start = parseISO(tournament.fechaInicio);
  
  const isStarted = isAfter(now, start);
  const canRegister = tournament.estado === "PUBLICADO" && isBefore(now, start);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300">
        
        {/* Badge arriba de todo */}
        <div className="px-8 pt-8 pb-2">
          <Badge variant="outline" className={
            canRegister 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
            : "bg-zinc-200/50 text-zinc-500 border-zinc-200"
          }>
            {canRegister ? "INSCRIPCIÓN ABIERTA" : isStarted ? "EN CURSO" : tournament.estado.replace('_', ' ')}
          </Badge>
        </div>

        <CardHeader className="px-8 pt-2 pb-4">
          <div className="flex justify-between items-start gap-4">
            {/* Trofeo al lado del título */}
            <div className="p-3 bg-zinc-950 rounded-2xl text-white shadow-lg shrink-0">
              <Trophy size={20} />
            </div>

            <div className="flex-1">
              <CardTitle className="text-2xl font-black tracking-tight mb-2 text-zinc-900 line-clamp-2 uppercase italic leading-none">
                {tournament.nombre}
              </CardTitle>
              <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                {tournament.descripcion || "Sin descripción disponible."}
              </p>
            </div> 
          </div>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-2">
          <div className="flex items-center gap-3 text-zinc-500 font-semibold text-xs border-t border-zinc-100/50 pt-4">
            <Calendar size={14} className="text-zinc-400" />
            <span>
                {isStarted ? "Empezó el: " : "Inicia: "}
                {format(start, "d 'de' MMMM", { locale: es })}
            </span>
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-4">
          <Button 
            variant={canRegister ? "default" : "secondary"}
            className={`w-full h-12 rounded-2xl font-bold transition-all group ${
              canRegister 
              ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-950/20" 
              : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
            }`}
            asChild
          >
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