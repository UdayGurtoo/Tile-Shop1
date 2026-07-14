export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new AdminApiError(
      (body as { error?: string }).error || `Request failed (${res.status})`,
      res.status
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function adminUpload(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false as const,
      status: res.status,
      error: (data as { error?: string }).error || "Upload failed",
    };
  }

  return {
    ok: true as const,
    data: data as {
      url: string;
      publicId?: string;
      thumbnailUrl?: string;
      width?: number;
      height?: number;
    },
  };
}
