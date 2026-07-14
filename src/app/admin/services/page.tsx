"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminServicesPage() {
  return (
    <EntityManager
      title="Services"
      endpoint="/api/admin/services"
      nameKey="title"
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
