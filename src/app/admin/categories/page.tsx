"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminCategoriesPage() {
  return (
    <EntityManager
      title="Categories"
      endpoint="/api/admin/categories"
      fields={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
        { key: "seoTitle", label: "SEO Title" },
        { key: "seoDescription", label: "SEO Description" },
      ]}
    />
  );
}
