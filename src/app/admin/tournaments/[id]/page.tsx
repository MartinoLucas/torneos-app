"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation"; // Agregamos useRouter
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Plus, Trophy, Calendar, Clock, Edit3, ChevronLeft, CalendarDays, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EditTournamentModal } from "@/features/tournaments/components/EditTournamentModal";
import { toast } from "sonner";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter(); // Para redireccionar tras borrar
  const id = params.id as string;
  const [tournament, setTournament] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const loadData = React.useCallback(() => {
    tournamentService.getById(id).then(setTournament).finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => { loadData(); }, [loadData]);

  // Handlers para el patrón State
  const onPublish = async () => {
    try {
      await tournamentService.publish(id);
      toast.success("Torneo publicado: Las inscripciones ya están abiertas");
      loadData();
    } catch (e) { toast.error("No se pudo publicar el torneo"); }
  };

  const onFinalize = async () => {
    try {
      await tournamentService.finalize(id);
      toast.success("Torneo finalizado");
      loadData();
    } catch (e) { toast.error("Error al finalizar el torneo"); }
  };

  const onDelete = async () => {
    try {
      await tournamentService.deleteDraft(id);
      toast.success("Torneo borrador eliminado");
      router.push("/admin/tournaments"); // Redirigir al listado
    } catch (e) { 
      toast.error("No se puede eliminar un torneo que no sea borrador"); }
  };

  const isBorrador = tournament?.estado === "BORRADOR";
  const isPublicado = tournament?.estado === "PUBLICADO";

  const compColumns: ColumnDef<any>[] = [
    { id: "nombre", header: "Competencia", cell: (row) => <span className="font-medium">{row.nombre}</span> },
    { id: "precio", header: "Precio", cell: (row) => <span className="font-bold">${row.precio}</span> },
    { id: "cupo", header: "Cupo", cell: (row) => row.cupo },
    { id: "estado", header: "Inscripciones", cell: (row) => (
      <Badge variant={row.abierta ? "default" : "secondary"}>{row.abierta ? "Abiertas" : "Cerradas"}</Badge>
    )},
  ];

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-400">Cargando...</div>;
  if (!tournament) return <div className="p-20 text-center text-red-500">Torneo no encontrado.</div>;

  return (
    <PageWrapper>
      <div className="container mx-auto py-10 space-y-8">
        <Link href="/admin/tournaments" className="flex items-center text-sm text-zinc-500 hover:text-zinc-900 w-fit">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a torneos
        </Link>

        <Card className="overflow-hidden border-zinc-200/80 shadow-sm">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 flex-row justify-between items-center space-y-0 py-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">ID: {tournament.id}</Badge>
              <StatusBadge status={tournament.estado} />
            </div>
            
            <div className="flex gap-2">
              {/* ACCIONES DE BORRADOR */}
              {isBorrador && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-2">
                    <Edit3 className="h-4 w-4" /> Editar
                  </Button>
                  
                  <ConfirmAction 
                    title="¿Eliminar Borrador?" 
                    description="Esta acción es permanente. Se borrarán todos los datos y competencias asociadas."
                    onConfirm={onDelete}
                  >
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </Button>
                  </ConfirmAction>

                  <ConfirmAction 
                    title="¿Publicar Torneo?" 
                    description="Una vez publicado no podrás editarlo ni borrarlo. Los participantes podrán inscribirse."
                    onConfirm={onPublish}
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Publicar
                    </Button>
                  </ConfirmAction>
                </>
              )}

              {/* ACCIONES DE PUBLICADO */}
              {isPublicado && (
                <ConfirmAction 
                  title="¿Finalizar Torneo?" 
                  description="Esto cerrará todas las inscripciones y el torneo pasará a historial."
                  onConfirm={onFinalize}
                >
                  <Button size="sm" variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" /> Finalizar Torneo
                  </Button>
                </ConfirmAction>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <h1 className="text-4xl font-black text-zinc-900">{tournament.nombre}</h1>
                <p className="text-zinc-600 leading-relaxed">{tournament.descripcion}</p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200">
                    <CalendarDays className="h-4 w-4 text-primary" /> {tournament.fechaInicio} / {tournament.fechaFin}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 space-y-3">
                <h3 className="text-xs font-bold uppercase text-zinc-400 text-center border-b pb-2 mb-2">Informacion de Auditoria</h3>
                <div className="text-sm flex justify-between">
                  <span className="text-zinc-500">Creado:</span>
                  <span className="font-medium text-xs">
                    {tournament.createdAt ? format(new Date(tournament.createdAt), "dd/MM/yy HH:mm", {locale: es}) : "-"}
                  </span>
                </div>
                <div className="text-sm flex justify-between">
                  <span className="text-zinc-500">Actualizado:</span>
                  <span className="font-medium text-xs">
                    {tournament.updatedAt ? format(new Date(tournament.updatedAt), "dd/MM/yy HH:mm", {locale: es}) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {tournament && (
          <EditTournamentModal 
            tournament={tournament} 
            open={isEditOpen} 
            onOpenChange={setIsEditOpen} 
            onSuccess={loadData} 
          />
        )}

        <DataTable 
          data={tournament.competencias || []} 
          columns={compColumns} 
          title="Competencias"
          description={isBorrador ? "Gestiona las competencias de este borrador." : "Las competencias están bloqueadas en este estado."}
          headerActions={isBorrador && (
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Nueva Competencia</Button>
          )}
        />
      </div>
    </PageWrapper>
  );
}

// Los componentes StatusBadge y ConfirmAction se mantienen iguales al anterior
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    BORRADOR: "bg-blue-100 text-blue-700 border-blue-200",
    PUBLICADO: "bg-green-100 text-green-700 border-green-200",
    FINALIZADO: "bg-red-100 text-red-700 border-red-200",
  };
  return <Badge className={`${styles[status]} border shadow-none`}>{status}</Badge>;
}

function ConfirmAction({ children, title, description, onConfirm }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-zinc-900 text-white hover:bg-zinc-800">
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}