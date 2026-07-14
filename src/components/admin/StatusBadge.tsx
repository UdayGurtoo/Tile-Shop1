type StatusBadgeProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

const variants: Record<string, string> = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  success: "bg-emerald-950/60 text-emerald-300 border-emerald-800/50",
  warning: "bg-amber-950/60 text-amber-300 border-amber-800/50",
  danger: "bg-red-950/60 text-red-300 border-red-800/50",
  info: "bg-sky-950/60 text-sky-300 border-sky-800/50",
};

const statusMap: Record<string, { label: string; variant: StatusBadgeProps["variant"] }> = {
  NEW: { label: "New", variant: "info" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  RESOLVED: { label: "Resolved", variant: "success" },
  SPAM: { label: "Spam", variant: "danger" },
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "default" },
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "default" },
  featured: { label: "Featured", variant: "warning" },
  new: { label: "New Arrival", variant: "info" },
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const mapped = statusMap[status];
  const label = mapped?.label ?? status.replace(/_/g, " ");
  const v = variant ?? mapped?.variant ?? "default";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${variants[v ?? "default"]}`}
    >
      {label}
    </span>
  );
}

export function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <StatusBadge
      status={value ? "published" : "draft"}
      variant={value ? "success" : "default"}
    />
  );
}
