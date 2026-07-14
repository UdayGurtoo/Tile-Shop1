"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminOffersPage() {
  return (
    <EntityManager
      title="Offers"
      endpoint="/api/admin/offers"
      nameKey="title"
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "discountText", label: "Discount text" },
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "linkUrl", label: "Link URL" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
