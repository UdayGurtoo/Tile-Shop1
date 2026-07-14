"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminTestimonialsPage() {
  return (
    <EntityManager
      title="Testimonials"
      endpoint="/api/admin/testimonials"
      fields={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "company", label: "Company" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "rating", label: "Rating", type: "number" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
