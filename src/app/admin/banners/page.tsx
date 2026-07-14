"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminBannersPage() {
  return (
    <EntityManager
      title="Banners"
      endpoint="/api/admin/banners"
      nameKey="title"
      fields={[
        { key: "title", label: "Title" },
        { key: "subtitle", label: "Subtitle" },
        { key: "imageUrl", label: "Image", type: "image" },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: [
            { value: "HERO", label: "Hero" },
            { value: "PROMO", label: "Promo" },
            { value: "OFFER", label: "Offer" },
            { value: "CATEGORY", label: "Category" },
          ],
        },
        { key: "linkUrl", label: "Link URL" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
