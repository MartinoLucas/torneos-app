"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
}: { control: Control<T>; name: Path<T>; label: string }) {
  const [show, setShow] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2 w-full">
          <Label htmlFor={name}>{label}</Label>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={show ? "text" : "password"}
              className={fieldState.error ? "border-destructive pr-10" : "pr-10"}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {fieldState.error && (
            <span className="text-xs text-destructive">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  );
}