"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Plus, Edit3, ChevronLeft, CalendarDays, CheckCircle2, XCircle, Trash2, Clock, Layers, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EditTournamentModal } from "@/features/tournaments/components/EditTournamentModal";
import { CreateCompetenciaModal } from "@/features/tournaments/components/CreateCompetenciaModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tournament, setTournament] = React.useState<any>(null);
  const [competitions, setCompetitions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isCompOpen, setIsCompOpen] = React.useState(false);

  const loadData = React.useCallback(() => {    
    setLoading(true);
    Promise.all([
      tournamentService.getById(id),
      tournamentService.getCompetitions(id)
    ]).then(([torneo, comps]: any) => {
      setTournament(torneo);
      setCompetitions(comps.content || []);
    }).finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const onPublish = async () => {
    try {
      await tournamentService.publish(id);
      toast.success("Torneo publicado");
      loadData();
    } catch (e) { toast.error("Error al publicar"); }
  };

  const onFinalize = async () => {
    try {
      await tournamentService.finalize(id);
      toast.success("Torneo finalizado");
      loadData();
    } catch (e) { toast.error("Error al finalizar"); }
  };

  const onDelete = async () => {
    try {
      await tournamentService.deleteDraft(id);
      toast.success("Borrador eliminado");
      router.push("/admin/tournaments");
    } catch (e) { toast.error("No se pudo eliminar"); }
  };

  const isBorrador = tournament?.estado === "BORRADOR";
  const isPublicado = tournament?.estado === "PUBLICADO";

  const compColumns: ColumnDef<any>[] = [
    { 
      id: "nombre", 
      header: "Competencia", 
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-black uppercase italic text-zinc-900 tracking-tight">{row.nombre}</span>
          <span className="text-[10px] text-zinc-400 font-medium">ID: {row.id}</span>
        </div>
      ) 
    },
    { 
      id: "precio", 
      header: "Precio", 
      cell: (row) => <span className="font-mono font-bold text-zinc-900">${row.precioBase.amount.toLocaleString('es-AR')}</span> 
    },
    { 
      id: "cupo", 
      header: "Cupo Total", 
      cell: (row) => <span className="text-zinc-600 font-medium">{row.cupo} plazas</span> 
    },
    { 
      id: "inscriptos", 
      header: "Progreso", 
      cell: (row) => {
        const porc = (row.inscriptosActuales / row.cupo) * 100;
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className={row.inscriptosActuales >= row.cupo ? "text-red-500" : "text-zinc-500"}>
                {row.inscriptosActuales} / {row.cupo}
              </span>
              <span>{Math.round(porc)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${row.inscriptosActuales >= row.cupo ? "bg-red-500" : "bg-primary"}`} 
                style={{ width: `${Math.min(porc, 100)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (row) => (
        <Link href={`/admin/tournaments/${id}/${row.id}`} className="inline-flex items-center text-sm font-bold text-primary hover:underline">
          <Users size={16} className="inline-block mr-1" />
          Ver Inscriptos
        </Link>
      )
    }
  ];

  if (loading) return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 bg-zinc-300 rounded-2xl" />
        <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Cargando Gestión...</p>
      </div>
    </div>
  );

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Admin Detail Hero */}
      <header className="w-full bg-zinc-950 text-white pt-20 pb-12 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/admin/tournaments" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver al listado
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono">#{tournament.id}</Badge>
                <StatusBadge status={tournament.estado} />
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                {tournament.nombre}
              </h1>
              <p className="text-zinc-400 max-w-2xl font-medium leading-relaxed">
                {tournament.descripcion || "Sin descripción detallada."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              {isBorrador && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="text-white hover:bg-zinc-800 rounded-xl font-bold">
                    <Edit3 className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <ConfirmAction title="¿Eliminar Borrador?" description="Esta acción no se puede deshacer." onConfirm={onDelete}>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-bold">
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </Button>
                  </ConfirmAction>
                  <ConfirmAction title="¿Publicar Torneo?" description="Se abrirán las inscripciones al público." onConfirm={onPublish}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Publicar
                    </Button>
                  </ConfirmAction>
                </>
              )}
              {isPublicado && (
                <ConfirmAction title="¿Finalizar Torneo?" description="Se cerrarán todas las inscripciones." onConfirm={onFinalize}>
                  <Button size="sm" variant="destructive" className="rounded-xl font-bold shadow-lg shadow-red-600/20">
                    <XCircle className="h-4 w-4 mr-2" /> Finalizar Torneo
                  </Button>
                </ConfirmAction>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-6 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar de Info Técnica */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <CalendarDays size={14} className="text-primary" /> Cronograma
              </h3>
              <div className="space-y-4 font-bold text-zinc-900 uppercase italic text-sm">
                <div className="flex flex-col border-l-2 border-primary pl-3">
                  <span className="text-[10px] text-zinc-400 not-italic tracking-normal uppercase">Inicia</span>
                  <span>{format(new Date(tournament.fechaInicio), "dd MMM, yyyy", { locale: es })}</span>
                </div>
                <div className="flex flex-col border-l-2 border-zinc-200 pl-3">
                  <span className="text-[10px] text-zinc-400 not-italic tracking-normal uppercase">Finaliza</span>
                  <span>{format(new Date(tournament.fechaFin), "dd MMM, yyyy", { locale: es })}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" /> Auditoría
              </h3>
              <div className="space-y-3 text-[11px] font-medium text-zinc-500 uppercase">
                <div className="flex justify-between"><span>Registrado:</span> <span className="text-zinc-900">{tournament.createdAt ? format(new Date(tournament.createdAt), "dd/MM/yy HH:mm", { locale: es }) : "-"}</span></div>
                <div className="flex justify-between"><span>Estado:</span> <span className="text-primary font-bold">{tournament.estado}</span></div>
              </div>
            </motion.div>
          </div>

          {/* Tabla de Competencias */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20"
            >
              <DataTable 
                data={competitions} 
                columns={compColumns} 
                title="Gestión de Categorías"
                description="Configura los precios, cupos y categorías disponibles."
                headerActions={isBorrador && (
                  <Button onClick={() => setIsCompOpen(true)} className="bg-zinc-950 text-white rounded-xl font-bold hover:bg-zinc-800">
                    <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
                  </Button>
                )}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {isEditOpen && <EditTournamentModal tournament={tournament} open={isEditOpen} onOpenChange={setIsEditOpen} onSuccess={loadData} />}
      {isCompOpen && <CreateCompetenciaModal tournamentId={id} open={isCompOpen} onOpenChange={setIsCompOpen} onSuccess={loadData} />}
    </PageWrapper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    BORRADOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PUBLICADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FINALIZADO: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return <Badge className={`${styles[status]} font-black uppercase italic text-[10px] tracking-widest px-3 py-1`}>{status === 'BORRADOR' ? 'MODO EDICIÓN' : status}</Badge>;
}

function ConfirmAction({ children, title, description, onConfirm }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem] border-zinc-200 bg-white/90 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black uppercase italic text-2xl tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-medium text-zinc-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl font-bold border-zinc-200">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-xl font-bold bg-zinc-950 text-white hover:bg-zinc-800">
            Confirmar Acción
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}