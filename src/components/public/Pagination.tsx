import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function buildHref(basePath: string, page: number, searchParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") params.set(k, v);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ page, totalPages, basePath, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && (
        <Link href={buildHref(basePath, page - 1, searchParams)} rel="prev">
          ← Prev
        </Link>
      )}
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} style={{ display: "contents" }}>
            {gap && <span>…</span>}
            {p === page ? (
              <span className="active">{p}</span>
            ) : (
              <Link href={buildHref(basePath, p, searchParams)}>{p}</Link>
            )}
          </span>
        );
      })}
      {page < totalPages && (
        <Link href={buildHref(basePath, page + 1, searchParams)} rel="next">
          Next →
        </Link>
      )}
    </nav>
  );
}
