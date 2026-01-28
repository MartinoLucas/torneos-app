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
import { Search } from "lucide-react";

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
}

export function DataTable<T>({
  title,
  description,
  data,
  columns,
  searchPlaceholder = "Buscar...",
  searchAccessor,
  headerActions,
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
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-zinc-50/30 transition-colors">
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={`
                          ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}
                          ${col.hideOnMobile ? "hidden md:table-cell" : ""}
                        `}
                      >
                        {col.cell(row, idx)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No se encontraron resultados.
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