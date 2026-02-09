"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { inscriptionService } from "@/features/inscriptions/services/inscription-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ArrowRight, CreditCard, UserCircle, Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const [inscriptions, setInscriptions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.id) {
      setLoading(true);
      inscriptionService.getMyInscriptions(user.id)
        .then((data: any) => {
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
          <span className="font-bold text-zinc-900 uppercase italic tracking-tight">{row.competencia.torneoNombre}</span>
          <span className="text-[10px] font-bold text-primary uppercase">{row.competencia.nombre}</span>
        </div>
      ),
    },
    {
      id: "fecha",
      header: "Inscripción",
      hideOnMobile: true,
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(row.fechaInscripcion), "dd MMM, yyyy", { locale: es })}
        </div>
      ),
    },
    {
      id: "pago",
      header: "Monto",
      cell: (row) => (
        <div className="flex flex-row items-center gap-2">
          <span className="font-mono font-bold text-zinc-900">
            ${row.precioPagado.amount}
          </span>
          {row.precioPagado.amount < row.competencia.precioBase.amount && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex w-fit font-black uppercase mt-1">
              50% Off
            </span>
          )}
        </div>
      ),
    },
    // {
    //   id: "estado",
    //   header: "Estado",
    //   cell: (row) => (
    //     <Badge 
    //       variant="outline"
    //       className={
    //         row.estado === "CONFIRMADA" 
    //           ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold" 
    //           : "bg-amber-50 text-amber-700 border-amber-200 font-bold"
    //       }
    //     >
    //       {row.estado}
    //     </Badge>
    //   ),
    // },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => (
        <Button variant="ghost" size="sm" asChild className="group hover:bg-zinc-100 rounded-xl">
          <Link href={`/tournaments/${row.competencia.torneo.id}`} className="font-bold text-xs uppercase tracking-tighter">
            Ver Torneo <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Hero Header - Negro Profundo */}
      <header className="w-full bg-zinc-950 text-white pt-20 pb-16 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <UserCircle className="h-4 w-4 text-primary" /> Perfil del Atleta
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                Mi <span className="text-zinc-400">Panel</span>
              </h1>
              <p className="text-zinc-400 font-medium">
                Bienvenido, <span className="text-white">{user?.sub || "Usuario"}</span>. Gestiona tus inscripciones y torneos.
              </p>
            </div>
            <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl font-bold px-8 h-12">
              <Link href="/">Explorar Torneos</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-8 pb-24 relative z-20">
        {/* Quick Stats con Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Torneos Activos", value: inscriptions.length, icon: Trophy },
            { label: "Estado Global", value: "Atleta", icon: Activity },
            { label: "Pagos Realizados", value: inscriptions.filter((i: any) => i.estado === "CONFIRMADA").length, icon: CreditCard },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-xl flex items-center justify-between"
            >
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black mt-1 text-zinc-900">{stat.value}</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-2xl text-white shadow-lg">
                <stat.icon size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabla con Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 uppercase italic leading-none">Mis Inscripciones</h2>
                  <p className="text-sm text-zinc-500 font-medium mt-1">Historial completo de competencias</p>
                </div>
            </div>
            
            <DataTable 
                data={inscriptions} 
                columns={columns} 
                loading={loading}
                searchPlaceholder="Filtrar por torneo o categoría..."
                searchAccessor={(row) => `${row.competencia.torneoNombre} ${row.competencia.nombre}`}
            />
        </div>
      </div>
    </PageWrapper>
  );
}