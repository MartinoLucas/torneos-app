"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { inscriptionService } from "@/features/inscriptions/services/inscription-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ArrowRight, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [inscriptions, setInscriptions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.id) {
      setLoading(true);
      inscriptionService.getMyInscriptions(user.id)
        .then((data: any) => {
          // Ajuste según tu API: si el interceptor ya devuelve el .body
          // y dentro del body está el .content (paginación de Spring)
          setInscriptions(data.content || data || []);
        })
        .catch(() => setInscriptions([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const columns: ColumnDef<any>[] = [
    {
      id: "torneo",
      header: "Torneo / Competencia",
      cell: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-zinc-900">{row.competencia.torneoNombre}</span>
          <span className="text-xs text-zinc-500">{row.competencia.nombre}</span>
        </div>
      ),
    },
    {
      id: "fecha",
      header: "Inscripción",
      hideOnMobile: true,
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-600 text-sm">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(row.fechaInscripcion), "dd/MM/yyyy", { locale: es })}
        </div>
      ),
    },
    {
      id: "pago",
      header: "Monto",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-zinc-900">
            ${row.montoTotal.toLocaleString()}
          </span>
          {row.montoTotal < row.competencia.precio && (
            <span className="text-[10px] text-green-600 font-bold uppercase tracking-tight">
              50% Off aplicado
            </span>
          )}
        </div>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: (row) => (
        <Badge 
          className={
            row.estado === "CONFIRMADA" 
              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
              : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"
          }
        >
          {row.estado}
        </Badge>
      ),
    },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => (
        <Button variant="ghost" size="sm" asChild className="group">
          <Link href={`/tournaments/${row.competencia.torneoId}`}>
            Ver Torneo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        {/* Bienvenida */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-zinc-900">
              <Trophy className="h-8 w-8 text-primary" /> Mi Panel
            </h1>
            <p className="text-zinc-500 mt-2">
              Hola, <span className="font-semibold text-zinc-800">{user?.sub}</span>. Aquí tienes el resumen de tus actividades.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Explorar nuevos torneos</Link>
          </Button>
        </header>

        {/* Stats rápidos (opcional, pero queda muy bien) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-sm font-medium">Torneos Activos</p>
            <p className="text-3xl font-black mt-1">{inscriptions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-sm font-medium">Próxima Competencia</p>
            <p className="text-lg font-bold mt-1 text-primary">
              {inscriptions.length > 0 ? "Ver listado" : "Ninguna"}
            </p>
          </div>
        </div>

        {/* Tabla de Inscripciones */}
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zinc-400" />
                <h2 className="text-xl font-bold text-zinc-800">Mis Inscripciones</h2>
            </div>
            
            <DataTable 
                data={inscriptions} 
                columns={columns} 
                loading={loading} // <-- Ahora esto compila perfectamente
                searchPlaceholder="Buscar por torneo o categoría..."
                searchAccessor={(row) => `${row.competencia.torneoNombre} ${row.competencia.nombre}`}
            />
        </div>
      </div>
    </PageWrapper>
  );
}