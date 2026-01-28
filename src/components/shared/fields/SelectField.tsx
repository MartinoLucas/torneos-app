"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  description?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2 w-full">
          <Label htmlFor={name} className={fieldState.error ? "text-destructive" : ""}>
            {label}
          </Label>
          <select
            {...field}
            id={name}
            className={`
              flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm 
              ring-offset-white focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${fieldState.error ? "border-destructive focus:ring-destructive" : ""}
            `}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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