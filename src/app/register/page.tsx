"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authService, CreateParticipanteDTO } from "@/features/auth/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SelectField } from "@/components/shared"; 
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<CreateParticipanteDTO>({
    defaultValues: {
      documento: {
        tipo: "DNI" as any, // Valor inicial para evitar el error de "undefined"
      }
    }
  });

  const tipoDocOptions = [
    { label: "DNI", value: "DNI" },
    { label: "Libreta de Enrolamiento", value: "LE" },
    { label: "Libreta Cívica", value: "LC" },
    { label: "Pasaporte", value: "PASAPORTE" },
  ];

  const onSubmit = async (data: CreateParticipanteDTO) => {
    try {
      const payload = {
        ...data,
        email: data.email.trim(), 
        documento: {
          tipo: data.documento.tipo,
          numero: String(data.documento.numero).trim()
        }
      };

      console.log("Enviando registro:", payload); // Mirá esto en la consola del navegador

      await authService.register(payload);
      toast.success("Cuenta creada exitosamente");
      router.push("/login");
    } catch (error) {
      // El error ya lo maneja el interceptor
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-zinc-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-black">Crear cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte como participante</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" {...register("nombre", { required: "El nombre es obligatorio" })} placeholder="Juan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" {...register("apellido", { required: "El apellido es obligatorio" })} placeholder="Pérez" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email", { required: "El email es obligatorio" })} placeholder="juan@ejemplo.com" />
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-1">
                <SelectField
                  control={control}
                  name="documento.tipo"
                  label="Tipo Doc."
                  options={tipoDocOptions}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="doc_num">Número de Documento</Label>
                <Input id="doc_num" {...register("documento.numero", { required: "El número es obligatorio" })} placeholder="12345678" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register("password", { required: "La contraseña es obligatoria" })} />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}