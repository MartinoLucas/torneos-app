"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, LayoutDashboard, Calendar, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    tournamentService.getAllAdmin()
      .then((res: any) => {
        setTournaments(res.content || res || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<any>[] = [
    { 
        id: "id", 
        header: "ID", 
        cell: (row) => <span className="font-mono text-[10px] text-zinc-400">#{row.id}</span> 
    },
    { 
        id: "nombre", 
        header: "Torneo", 
        cell: (row) => (
            <div className="flex flex-col">
                <span className="font-black uppercase italic text-zinc-900 tracking-tight">{row.nombre}</span>
                <span className="text-[10px] text-zinc-500 font-medium">Ref: {row.nombre.substring(0,3).toUpperCase()}-{row.id}-{new Date().getFullYear().toString().substring(2)}</span>
            </div>
        )
    },
    { 
        id: "fecha", 
        header: "Inicio", 
        cell: (row) => (
            <div className="flex items-center gap-2 text-zinc-600 font-medium">
                <Calendar className="h-3 w-3" />
                {format(new Date(row.fechaInicio), "dd MMM, yyyy", { locale: es })}
            </div>
        ) 
    },
    { 
      id: "competencias", 
      header: "Competencias", 
      cell: (row) => (
          <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-primary" />
              <span className="font-bold">{row.competencias?.length || 0}</span>
          </div>
      )
    },
    {
        id: "estado",
        header: "Estado",
        cell: (row) => {
            const styles: any = {
                BORRADOR: "bg-blue-50 text-blue-600 border-blue-200",
                PUBLICADO: "bg-emerald-50 text-emerald-600 border-emerald-200",
                FINALIZADO: "bg-zinc-100 text-zinc-500 border-zinc-200",
            };
            const label: any = {
                BORRADOR: "BORRADOR",
                PUBLICADO: "EN CURSO",
                FINALIZADO: "CERRADO",
            };
            return (
                <Badge variant="outline" className={`${styles[row.estado] || ""} font-black text-[10px] px-2`}>
                    {label[row.estado] || row.estado}
                </Badge>
            );
        },
    },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => (
        <Button variant="outline" size="sm" asChild className="rounded-xl border-zinc-200 hover:bg-zinc-950 hover:text-white transition-all group">
          <Link href={`/admin/tournaments/${row.id}`} className="font-bold text-xs uppercase tracking-tighter">
            <Settings2 className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" /> Gestionar
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Admin Hero Header */}
      <header className="w-full bg-zinc-950 text-white pt-20 pb-16 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05),transparent)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <LayoutDashboard className="h-4 w-4 text-primary" /> Gestión de Contenidos
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                Panel <span className="text-zinc-400">Admin</span>
              </h1>
              <p className="text-zinc-400 font-medium">
                Control total sobre torneos, categorías y estados de publicación.
              </p>
            </div>
            
            <Button asChild className="bg-primary text-primary-foreground hover:scale-105 transition-transform rounded-2xl font-bold px-8 h-12 shadow-lg shadow-primary/20">
              <Link href="/admin/tournaments/new">
                <Plus className="h-5 w-5 mr-2" /> Nuevo Torneo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-8 pb-24 relative z-20">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20"
        >
            <DataTable 
              data={tournaments} 
              columns={columns} 
              loading={loading}
              searchPlaceholder="Buscar por nombre del evento..."
              searchAccessor={(row) => row.nombre}
              title="Listado de Torneos"
              description="Monitorea el ciclo de vida de tus eventos deportivos."
            />
        </motion.div>
      </div>
    </PageWrapper>
  );
}