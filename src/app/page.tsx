"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { tournamentService, Tournament } from "@/features/tournaments/services/tournament-service";
import { TournamentCard } from "@/features/tournaments/components/TournamentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    tournamentService.getUpcoming()
      .then((data) => {
        // 'data' ahora es el objeto paginado, extraemos 'content'
        if (data && Array.isArray(data.content)) {
          setTournaments(data.content);
        } else {
          console.error("No se encontró el array 'content':", data);
          setTournaments([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar torneos:", err);
        setTournaments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <section className="container mx-auto px-4 py-12">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            Competí en los mejores <br />
            <span className="text-primary">Torneos de la Región</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Explorá las próximas competencias, inscribite fácilmente y hacé un seguimiento de tu progreso.
          </motion.p>
        </div>

        {/* Listado de Torneos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeletons con Tailwind 4 (usando clases nativas como w-full)
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 p-4 border rounded-xl">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : (
            tournaments.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TournamentCard tournament={t} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </PageWrapper>
  );
}