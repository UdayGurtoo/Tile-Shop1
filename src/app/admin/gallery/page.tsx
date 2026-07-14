"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminGalleryPage() {
  return (
    <EntityManager
      title="Gallery"
      endpoint="/api/admin/gallery"
      nameKey="title"
      fields={[
        { key: "title", label: "Title" },
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "category", label: "Category (e.g. kitchen)" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
