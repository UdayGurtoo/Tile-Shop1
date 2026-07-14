"use client";

import { useState } from "react";
import { btnDanger, btnSecondary } from "./FormField";

type ConfirmButtonProps = {
  onConfirm: () => void | Promise<void>;
  label?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  message?: string;
  variant?: "danger" | "secondary";
  disabled?: boolean;
  className?: string;
};

export default function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  message = "Are you sure?",
  variant = "danger",
  disabled,
  className = "",
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const baseClass = variant === "danger" ? btnDanger : btnSecondary;

  if (!open) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`${baseClass} ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <span className="text-xs text-zinc-400">{message}</span>
      <button
        type="button"
        disabled={busy}
        onClick={handleConfirm}
        className={btnDanger}
      >
        {busy ? "…" : confirmLabel}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen(false)}
        className={btnSecondary}
      >
        {cancelLabel}
      </button>
    </div>
  );
}
