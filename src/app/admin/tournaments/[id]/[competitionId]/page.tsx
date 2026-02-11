"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, User, CreditCard, Calendar, Download } from "lucide-react";
import Link from "next/link";
import { format, set } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CompetitionInscriptionsPage() {
  const { id: tournamentId, competitionId } = useParams();
  const [data, setData] = React.useState<any>(null); // Guardaremos info de la competencia + inscriptos
  const [loading, setLoading] = React.useState(true);
  const [totalRecaudado, setTotalRecaudado] = React.useState(0);

  React.useEffect(() => {
    // Aquí llamarías a un endpoint que traiga los inscriptos de esa competencia específica
    // tournamentService.getInscriptionsByCompetition(competitionId)
    const fetchData = async () => {
      setLoading(true);
      try {
        const torneo = await tournamentService.getById(tournamentId as string);
        const inscripciones = await tournamentService.getInscriptionsByCompetition(tournamentId as string, competitionId as string).then(res => res.content);
        const competencia = await tournamentService.getCompetitions(tournamentId as string).then(res => res.content.find((comp: any) => comp.id === parseInt(competitionId as string)));
        setData({
          torneo,
          competencia,
          inscriptos: inscripciones
        });
        setTotalRecaudado(inscripciones.reduce((total: number, inscripcion: any) => total + inscripcion.precioPagado.amount, 0));
        console.log("Torneo: ", torneo);
        console.log("Competencia: ", competencia);
        console.log("Inscriptos: ", inscripciones);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId, competitionId]);

  const columns: ColumnDef<any>[] = [
    { 
      id: "atleta", 
      header: "Atleta", 
      cell: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-black uppercase italic text-zinc-900 tracking-tight">{row.participante.nombre} {row.participante.apellido}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Mail size={10} className="text-primary" /> {row.participante.email}
          </div>
        </div>
      ) 
    },
    { 
      id: "fecha", 
      header: "Fecha Insc.", 
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
          <Calendar size={14} />
          {format(new Date(row.fechaInscripcion), "dd/MM/yyyy HH:mm")}
        </div>
      )
    },
    { 
      id: "monto", 
      header: "Monto Pagado", 
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-zinc-900">${row.precioPagado.amount.toLocaleString('es-AR')}</span>
          {row.monto < 12000 && <span className="text-[9px] text-emerald-600 font-black uppercase">50% OFF Aplicado</span>}
        </div>
      )
    },
    {
      id: "estado",
      header: "Estado Pago",
      cell: (row) => (
          <>
            {row.precioPagado.amount < row.competencia.precioBase.amount ? (
              <Badge variant="outline" className="font-black text-[12px] px-1 bg-emerald-50 text-emerald-600 border-emerald-200">
                50% OFF Aplicado
              </Badge>
            ): (
              <Badge variant="outline" className="font-black text-[12px] px-1 bg-green-50 text-green-600 border-green-200">
                Pago Completo
              </Badge>
            )}
          </>
      )
    }
  ];

  if (loading) return <PageWrapper isLoading={true} loadingMessage="Cargando lista de atletas..." children={null} />;

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      {/* Hero Header Contextual */}
      <header className="w-full bg-zinc-950 text-white pt-20 pb-12 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.15),transparent)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href={`/admin/tournaments/${tournamentId}`} className="inline-flex items-center text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" /> Volver al torneo
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                <User size={14} /> Control de Inscriptos
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                {data.competencia.nombre}
              </h1>
              <p className="text-zinc-400 font-medium uppercase text-xs tracking-widest">
                Torneo: <span className="text-white">{data.torneo.nombre}</span>
              </p>
            </div>

            {/* <Button variant="outline" className="border-zinc-700 text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl font-bold h-12 px-6">
              <Download className="h-4 w-4 mr-2" /> Exportar Lista
            </Button> */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-8 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Stats Rápidas */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-primary" /> Resumen Caja
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Precio Base</span>
                  <span className="text-2xl font-black text-zinc-600 font-mono italic">${data.competencia.precioBase.amount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-500 uppercase font-bold">Total Recaudado</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono italic">${totalRecaudado.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Inscriptos</span>
                  <span className="text-2xl font-black text-zinc-900 font-mono italic">{data.inscriptos.length}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabla de Atletas */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20"
            >
              <DataTable 
                data={data.inscriptos} 
                columns={columns} 
                title="Lista de Atletas"
                description="Listado oficial de competidores inscriptos en esta categoría."
                searchPlaceholder="Buscar atleta por nombre o email..."
              />
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}