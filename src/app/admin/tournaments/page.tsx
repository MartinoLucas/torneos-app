"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    tournamentService.getAllAdmin()
      .then((res: any) => {
        // Accedemos a .content o al array directo si tu interceptor ya limpia la data
        setTournaments(res.content || res || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<any>[] = [
    { id: "id", header: "ID", cell: (row) => row.id },
    { id: "nombre", header: "Nombre", cell: (row) => <span className="font-bold">{row.nombre}</span> },
    { id: "fecha", header: "Fecha Inicio", cell: (row) => row.fechaInicio },
    { 
      id: "competencias", 
      header: "Categorías", 
      cell: (row) => row.competencias?.length || 0 
    },
    {
        id: "estado",
        header: "Estado",
        cell: (row) => {
            switch (row.estado) {
                case "BORRADOR":
                    return <Badge variant="outline" className="text-blue-500">CREADO</Badge>;
                case "PUBLICADO":
                    return <Badge variant="outline" className="text-green-500">EN CURSO</Badge>;
                case "FINALIZADO":
                    return <Badge variant="outline" className="text-red-500">FINALIZADO</Badge>;
                default:
                    return <Badge variant="outline">{row.estado.toUpperCase()}</Badge>;
            }
        },
    },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/tournaments/${row.id}`}>
              <Settings2 className="h-4 w-4 mr-2" /> Gestionar
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black">Panel de Administración</h2>
          </div>
        </div>

        <DataTable 
          data={tournaments} 
          columns={columns} 
          loading={loading}
          searchAccessor={(row) => row.nombre}
          title="Gestion de Torneos"
          description="Crea y administra los torneos y sus categorias"
          headerActions={
            <Button asChild>
              <Link href="/admin/tournaments/new">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Torneo
              </Link>
            </Button>
          }
        />
      </div>
    </PageWrapper>
  );
}