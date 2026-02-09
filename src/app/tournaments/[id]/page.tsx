"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, Trophy, Info, ArrowLeft, 
  AlertCircle, Share2, Clock, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { CompetitionList } from "@/features/tournaments/components/CompetitionList";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [canRegister, setCanRegister] = React.useState(false);

  // Estilos de estado con efecto Glassmorphism mejorado
  const statusStyles = {
    open: {
      card: "bg-emerald-50/40 backdrop-blur-md border-emerald-100/50",
      innerBox: "bg-white/40 border-emerald-200/30 text-emerald-900",
      icon: "text-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    },
    closed: {
      card: "bg-zinc-100/40 backdrop-blur-md border-zinc-200/50",
      innerBox: "bg-white/30 border-zinc-200/30 text-zinc-500",
      icon: "text-zinc-400",
      badge: "bg-zinc-100 text-zinc-500 border-zinc-200"
    }
  };

  const currentStyle = canRegister ? statusStyles.open : statusStyles.closed;

  React.useEffect(() => {
    if (id) {
      tournamentService.getById(id as string)
        .then((data) => {
          setTournament(data);
          const now = new Date();
          const startDate = parseISO(data.fechaInicio);
          const isPublished = data.estado === "PUBLICADO";
          const isBeforeStart = isBefore(now, startDate);
          setCanRegister(isPublished && isBeforeStart);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-zinc-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
    </div>
  );
  
  if (!tournament) return <div className="p-20 text-center font-bold text-zinc-500 bg-zinc-50">Torneo no disponible.</div>;

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Header / Hero Section */}
      <div className="w-full bg-zinc-950 text-white border-b border-zinc-800">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 text-zinc-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
            </Button>
          </Link>

          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={
                canRegister 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" 
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }>
                {canRegister ? "Inscripciones Abiertas" : tournament.estado.replace('_', ' ')}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic">
              {tournament.nombre}
            </h1>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Fecha de Inicio</span>
                <span className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <Calendar className="h-4 w-4 text-zinc-400" /> 
                  {format(parseISO(tournament.fechaInicio), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
              <Separator orientation="vertical" className="h-10 bg-zinc-800 hidden md:block" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Fecha de Fin</span>
                <span className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <Calendar className="h-4 w-4 text-zinc-400" /> 
                  {format(parseISO(tournament.fechaFin), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda con Efecto Glass */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-950 flex items-center justify-center">
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Acerca del torneo</h2>
                </div>
                <p className="text-lg text-zinc-600 leading-relaxed pl-4 border-l-2 border-zinc-300/50">
                  {tournament.descripcion || "Sin descripción adicional."}
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-950 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Competencias Disponibles</h2>
                  </div>
                </div>
                <CompetitionList tournamentId={id as string} canRegister={canRegister} />
              </section>
            </div>
          </div>

          {/* Sidebar con Efecto Glass */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className={`shadow-2xl border transition-all duration-700 rounded-3xl overflow-hidden ${currentStyle.card}`}>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Panel de Registro
                  </h4>
                  
                  <div className={`p-6 rounded-2xl border transition-all ${currentStyle.innerBox}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm ${currentStyle.icon}`}>
                        {canRegister ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      </div>
                      <span className="font-bold tracking-tight text-sm">
                        {canRegister ? "Inscripciones Abiertas" : "Registro Cerrado"}
                      </span>
                    </div>
                    
                    <p className="text-xs opacity-90 leading-relaxed">
                      {canRegister 
                        ? "Puedes elegir tu categoría e inscribirte ahora mismo." 
                        : "Este torneo ya no acepta nuevos participantes."}
                    </p>
                    
                    <div className="mt-4">
                      <div className={`inline-block text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${currentStyle.badge}`}>
                          {canRegister ? "Acción Requerida" : "Finalizado"}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl h-12 border-white/40 bg-white/40 backdrop-blur-lg font-bold gap-2 text-zinc-700 hover:bg-white/60 transition-all active:scale-95 shadow-sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("¡Enlace copiado!", {
                      description: "Comparte este torneo con otros participantes.",
                      icon: <Share2 className="h-4 w-4 text-emerald-500" />
                    });
                  }}
                >
                  <Share2 className="h-4 w-4" /> Compartir torneo
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}