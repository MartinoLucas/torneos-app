"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2 w-full">
          <Label htmlFor={name} className={fieldState.error ? "text-destructive" : ""}>
            {label}
          </Label>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {fieldState.error && (
            <span className="text-xs font-medium text-destructive">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}