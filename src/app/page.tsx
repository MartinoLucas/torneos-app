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
        if (data && Array.isArray(data.content)) {
          setTournaments(data.content);
        } else {
          setTournaments([]);
        }
      })
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Hero Section: Negro Profundo e Italic para coherencia */}
      <section className="w-full bg-zinc-950 text-white py-24 mb-12 border-b border-zinc-800 relative overflow-hidden">
        {/* Decoración sutil de fondo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,0.5),rgba(9,9,11,1))]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic mb-6">
              Competí en los <br />
              <span className="text-zinc-400">Mejores Torneos</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Explorá las próximas competencias, inscribite en segundos y 
              llevá tu rendimiento al siguiente nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Listado de Torneos sobre fondo grisáceo */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 h-80 space-y-4">
                <Skeleton className="h-40 w-full rounded-2xl bg-zinc-200" />
                <Skeleton className="h-6 w-3/4 bg-zinc-200" />
                <Skeleton className="h-4 w-full bg-zinc-200" />
              </div>
            ))
          ) : (
            tournaments.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
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