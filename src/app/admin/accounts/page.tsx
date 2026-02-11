"use client";

import * as React from "react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { adminAccountService } from "@/features/admin/services/admin-account-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ShieldCheck, Power, PowerOff, Edit3, Mail, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreateAdminModal } from "@/features/admin/components/CreateAdminModal";

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = React.useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res: any = await adminAccountService.getAll();
      setAccounts(res.content || res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { loadAccounts(); }, []);

  const handleToggleStatus = async (id: string, active: boolean) => {
    try {
      if (active) await adminAccountService.deactivate(id);
      else await adminAccountService.activate(id);
      toast.success(`Cuenta ${active ? 'desactivada' : 'activada'} correctamente`);
      loadAccounts();
    } catch (e) { toast.error("Error al cambiar estado"); }
  };

  const columns: ColumnDef<any>[] = [
    { 
      id: "info", 
      header: "Administrador", 
      cell: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-black uppercase italic text-zinc-900 tracking-tight">{row.nombre} {row.apellido}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Mail size={10} className="text-primary" /> {row.email}
          </div>
        </div>
      )
    },
    { 
      id: "id", 
      header: "ID / Identidad", 
      cell: (row) => (
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px]">
          <Fingerprint size={12} /> #{row.id}
        </div>
      )
    },
    {
      id: "estado",
      header: "Estado",
      cell: (row) => (
        <Badge variant="outline" className={`font-black text-[10px] px-2 ${!row.deletedAt ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {!row.deletedAt ? "ACTIVO" : "INACTIVO"}
        </Badge>
      ),
    },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleToggleStatus(row.id, !row.deletedAt)}
            className={`rounded-xl transition-all ${!row.deletedAt ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'}`}
          >
            {!row.deletedAt ? <PowerOff size={16} /> : <Power size={16} />}
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 hover:bg-zinc-950 hover:text-white group">
            <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="bg-zinc-100 min-h-screen">
      <header className="w-full bg-zinc-950 text-white pt-20 pb-16 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(var(--primary-rgb),0.05),transparent)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-primary" /> Seguridad de Sistema
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                Cuentas <span className="text-zinc-500">Admin</span>
              </h1>
              <p className="text-zinc-400 font-medium max-w-md">
                Gestión de privilegios y control de acceso para el personal administrativo.
              </p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:scale-105 transition-transform rounded-2xl font-bold px-8 h-12 shadow-lg shadow-primary/20"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" /> Nuevo Admin
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
            data={accounts} 
            columns={columns} 
            loading={loading}
            searchPlaceholder="Buscar por nombre o email..."
            title="Usuarios de Sistema"
            description="Control de activación y perfiles de administradores."
          />
        </motion.div>
      </div>

      <CreateAdminModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onSuccess={loadAccounts} 
        />
    </PageWrapper>
  );
}