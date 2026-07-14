"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminBrandsPage() {
  return (
    <EntityManager
      title="Brands"
      endpoint="/api/admin/brands"
      fields={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "logoUrl", label: "Logo", type: "image" },
        { key: "website", label: "Website" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
