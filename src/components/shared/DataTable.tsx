"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Inbox, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

export type ColumnDef<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
};

interface DataTableProps<T> {
  title?: string;
  description?: string;
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  headerActions?: React.ReactNode;
  loading?: boolean;
}

export function DataTable<T>({
  title,
  description,
  data,
  columns,
  searchPlaceholder = "Buscar...",
  searchAccessor,
  headerActions,
  loading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    const s = searchTerm.toLowerCase();
    return data.filter((row) => {
      const valueToSearch = searchAccessor 
        ? searchAccessor(row) 
        : JSON.stringify(row);
      return valueToSearch.toLowerCase().includes(s);
    });
  }, [data, searchTerm, searchAccessor]);

  return (
    <div className="w-full space-y-6">
      {/* Header de la Tabla */}
      {(title || description || headerActions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-2">
          <div>
            {title && (
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-zinc-500 font-medium mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
          </div>
        </div>
      )}

      {/* Contenedor Principal (Efecto Vidrio) */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden transition-all duration-300">
        
        {/* Barra de búsqueda integrada */}
        <div className="p-6 pb-2">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-zinc-100/50 border-transparent focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all duration-300 rounded-2xl h-11 placeholder:text-zinc-400 font-medium"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-100">
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={`
                      h-12 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400
                      ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                      ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                    `}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`} className="border-zinc-50">
                    {columns.map((col) => (
                      <TableCell 
                        key={`skeleton-cell-${col.id}`}
                        className={`px-6 py-4 ${col.hideOnMobile ? "hidden md:table-cell" : ""}`}
                      >
                        <Skeleton className="h-5 w-full rounded-lg bg-zinc-200/50" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex} 
                    className="group border-zinc-50 hover:bg-zinc-50/80 transition-all duration-200"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={`
                          px-6 py-4 text-sm
                          ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                          ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                        `}
                      >
                        {col.cell(row, rowIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center gap-3"
                    >
                      <div className="bg-zinc-100 p-4 rounded-3xl">
                        <Inbox className="h-10 w-10 text-zinc-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black uppercase italic text-zinc-900 tracking-tight">Sin resultados</p>
                        <p className="text-xs text-zinc-500 font-medium">No encontramos lo que buscas por aquí.</p>
                      </div>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}