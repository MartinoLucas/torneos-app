"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface FormTemplateProps<T extends z.ZodObject<any>> {
  schema: T;
  defaultValues: DefaultValues<z.infer<T>>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  title: string;
  description?: string;
  submitText?: string;
  children: (ctx: { form: UseFormReturn<z.infer<T>>; isPending: boolean }) => React.ReactNode;
}

export function FormTemplate<T extends z.ZodObject<any>>({
  schema,
  defaultValues,
  onSubmit,
  title,
  description,
  submitText = "Guardar",
  children,
}: FormTemplateProps<T>) {
  const [isPending, startTransition] = React.useTransition();
  
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleFormSubmit = (values: z.infer<T>) => {
    startTransition(async () => {
      try {
        await onSubmit(values);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="w-full shadow-xl border-zinc-200/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form id="dynamic-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {children({ form, isPending })}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 bg-zinc-50/50 p-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()} 
            disabled={isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
          </Button>
          <Button type="submit" form="dynamic-form" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isPending ? "Enviando..." : submitText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}