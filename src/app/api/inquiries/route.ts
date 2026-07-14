import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { contactInquirySchema } from "@/lib/validations";
import { jsonOk, jsonError, escapeHtml } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await rateLimit(`inquiry:${ip}`, 10, 60_000);
  if (!rl.success) return jsonError("Too many requests. Please try again later.", 429);

  const body = await req.json();
  const parsed = contactInquirySchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid data");

  const storeId = await getStoreId();
  const data = parsed.data;

  const inquiry = await prisma.contactInquiry.create({
    data: {
      storeId,
      name: escapeHtml(data.name).slice(0, 120),
      phone: data.phone ? escapeHtml(data.phone).slice(0, 30) : null,
      email: data.email || null,
      subject: data.subject ? escapeHtml(data.subject).slice(0, 200) : null,
      message: escapeHtml(data.message).slice(0, 5000),
      productId: data.productId || null,
    },
  });

  return jsonOk({ id: inquiry.id, message: "Thank you! We will contact you soon." }, { status: 201 });
}
