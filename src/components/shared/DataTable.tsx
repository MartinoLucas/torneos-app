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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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

  // Lógica de filtrado reactiva
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
    <Card className="w-full shadow-sm border-zinc-200/60 bg-white">
      {(title || description || headerActions) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabla Responsiva */}
        <div className="rounded-md border border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={`
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
              // Mostrar Skeletons solo mientras loading sea true
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((col) => (
                    <TableCell 
                      key={`skeleton-cell-${col.id}`}
                      className={col.hideOnMobile ? "hidden md:table-cell" : ""}
                    >
                      <Skeleton className="h-6 w-full rounded-md opacity-50" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              // Mostrar datos si hay
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-zinc-50/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={`
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
              // ESTADO VACÍO: Solo se muestra si loading es false y no hay data
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <CreditCard className="h-10 w-10 text-zinc-200" />
                    <p className="font-medium text-lg italic">No tienes inscripciones aún</p>
                    <p className="text-sm not-italic">Explora los torneos disponibles para empezar.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}