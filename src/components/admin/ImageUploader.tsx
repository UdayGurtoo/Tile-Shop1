"use client";

import { useRef, useState } from "react";

type Uploaded = { url: string; publicId?: string; thumbnailUrl?: string };

export function ImageUploader({
  onUploaded,
  multiple = false,
}: {
  onUploaded: (files: Uploaded[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    setError("");
    const uploaded: Uploaded[] = [];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "mohit-tiles");
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data);
      }
      onUploaded(uploaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={(e) => uploadFiles(e.target.files)} />
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Or paste image URL"
          style={{ flex: 1, padding: 8, border: "1px solid #ddd" }}
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            if (!url.trim()) return;
            onUploaded([{ url: url.trim(), thumbnailUrl: url.trim() }]);
            setUrl("");
          }}
        >
          Add URL
        </button>
      </div>
      {loading ? <p style={{ fontSize: 13 }}>Uploading...</p> : null}
      {error ? <p style={{ color: "#dc3545", fontSize: 13 }}>{error}</p> : null}
    </div>
  );
}
