import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string);
  emptyMessage?: string;
  loading?: boolean;
};

export default function AdminTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "No records found.",
  loading = false,
}: AdminTableProps<T>) {
  const getKey = (row: T, index: number) => {
    if (typeof keyField === "function") return keyField(row);
    const value = row[keyField];
    return String(value ?? index);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
        Loading…
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
      <table className="min-w-full divide-y divide-zinc-800 text-sm">
        <thead className="bg-zinc-900/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-amber-400/90 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {data.map((row, index) => (
            <tr key={getKey(row, index)} className="hover:bg-zinc-900/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-zinc-200 ${col.className ?? ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
