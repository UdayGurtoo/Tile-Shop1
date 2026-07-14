"use client";

import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminFaqsPage() {
  return (
    <EntityManager
      title="FAQs"
      endpoint="/api/admin/faqs"
      nameKey="question"
      fields={[
        { key: "question", label: "Question" },
        { key: "answer", label: "Answer", type: "textarea" },
        { key: "category", label: "Category" },
        { key: "sortOrder", label: "Sort order", type: "number" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
