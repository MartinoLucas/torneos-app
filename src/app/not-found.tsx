"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-zinc-100 p-6 rounded-full mb-6 text-zinc-400">
          <FileQuestion className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">404 - No Encontrado</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          La página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>
        <Button asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}