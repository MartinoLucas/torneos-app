"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tournament } from "../services/tournament-service";
import Link from "next/link";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
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
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
              Abierto
            </span>
          </div>
          <CardTitle className="mt-4 line-clamp-1">{tournament.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {tournament.descripcion}
          </p>
          <div className="flex items-center text-xs text-zinc-500 gap-2">
            <Calendar size={14} />
            <span>Inicia: {format(new Date(tournament.fechaInicio), "PPP", { locale: es })}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-50 pt-4">
          <Button variant="ghost" className="w-full group" asChild>
            <Link href={`/tournaments/${tournament.id}`}>
                Ver detalle 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}