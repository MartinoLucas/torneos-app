"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Plus, Edit3, ChevronLeft, CalendarDays, CheckCircle2, XCircle, Trash2, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EditTournamentModal } from "@/features/tournaments/components/EditTournamentModal";
import { CreateCompetenciaModal } from "@/features/tournaments/components/CreateCompetenciaModal";
import { toast } from "sonner";

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
    { id: "nombre", header: "Competencia", cell: (row) => <span className="font-medium">{row.nombre}</span> },
    { id: "precio", header: "Precio", cell: (row) => <span className="font-bold">${row.precioBase.amount}</span> },
    { id: "cupo", header: "Cupo", cell: (row) => row.cupo },
    { id: "inscriptos", header: "Inscriptos", cell: (row) => (
      <span className={row.inscriptosActuales >= row.cupo ? "text-red-500 font-bold" : ""}>
        {row.inscriptosActuales} / {row.cupo}
      </span>
    )},
  ];

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-400">Cargando...</div>;
  if (!tournament) return <div className="p-20 text-center">No se encontró el torneo.</div>;

  return (
    <PageWrapper>
      <div className="container mx-auto py-10 space-y-8">
        <Link href="/admin/tournaments" className="flex items-center text-sm text-zinc-500 hover:text-zinc-900 w-fit">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver
        </Link>

        <Card className="overflow-hidden border-zinc-200/80 shadow-sm">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 flex-row justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">ID: {tournament.id}</Badge>
              <StatusBadge status={tournament.estado} />
            </div>
            <div className="flex gap-2">
              {isBorrador && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}><Edit3 className="h-4 w-4 mr-2" /> Editar</Button>
                  <ConfirmAction title="¿Eliminar Borrador?" description="Esta acción es permanente." onConfirm={onDelete}>
                    <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Eliminar</Button>
                  </ConfirmAction>
                  <ConfirmAction title="¿Publicar Torneo?" description="Abrirá las inscripciones y no se podrá editar." onConfirm={onPublish}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-4 w-4 mr-2" /> Publicar</Button>
                  </ConfirmAction>
                </>
              )}
              {isPublicado && (
                <ConfirmAction title="¿Finalizar Torneo?" description="Cierra inscripciones permanentemente." onConfirm={onFinalize}>
                  <Button size="sm" variant="destructive"><XCircle className="h-4 w-4 mr-2" /> Finalizar</Button>
                </ConfirmAction>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <h1 className="text-4xl font-black">{tournament.nombre}</h1>
                <p className="text-zinc-600">{tournament.descripcion}</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold bg-zinc-100 p-2 rounded-md">
                    <CalendarDays className="h-4 w-4 text-primary" /> {tournament.fechaInicio} / {tournament.fechaFin}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border space-y-2 text-sm">
                <p className="text-zinc-400 font-bold uppercase text-[10px]">Auditoría</p>
                <div className="flex justify-between"><span>Creado:</span> <span>{tournament.createdAt ? format(new Date(tournament.createdAt), "dd/MM/yy HH:mm") : "-"}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditOpen && <EditTournamentModal tournament={tournament} open={isEditOpen} onOpenChange={setIsEditOpen} onSuccess={loadData} />}
        {isCompOpen && <CreateCompetenciaModal tournamentId={id} open={isCompOpen} onOpenChange={setIsCompOpen} onSuccess={loadData} />}

        <DataTable 
          data={competitions} 
          columns={compColumns} 
          title="Competencias"
          headerActions={isBorrador && (
            <Button size="sm" onClick={() => setIsCompOpen(true)}><Plus className="h-4 w-4 mr-2" /> Nueva Competencia</Button>
          )}
        />
      </div>
    </PageWrapper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    BORRADOR: "bg-blue-100 text-blue-700 border-blue-200",
    PUBLICADO: "bg-green-100 text-green-700 border-green-200",
    FINALIZADO: "bg-red-100 text-red-700 border-red-200",
  };
  return <Badge className={`${styles[status]} border`}>{status}</Badge>;
}

function ConfirmAction({ children, title, description, onConfirm }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}