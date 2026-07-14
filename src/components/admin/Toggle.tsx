"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
};

export default function Toggle({
  checked,
  onChange,
  label,
  disabled,
  id,
}: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-amber-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {label && <span className="text-sm text-zinc-300">{label}</span>}
    </label>
  );
}
