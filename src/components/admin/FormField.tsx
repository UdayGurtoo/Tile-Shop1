import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-200"
      >
        {label}
        {required && <span className="ml-1 text-amber-400">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-zinc-500">{hint}</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40";

export const selectClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40";

export const textareaClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40 min-h-[100px]";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50";

export const btnDanger =
  "inline-flex items-center justify-center rounded-md border border-red-800/60 bg-red-950/40 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50";
