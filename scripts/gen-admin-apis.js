const fs = require("fs");
const path = require("path");

function write(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c);
  console.log("wrote", p);
}

const entities = [
  {
    name: "testimonials",
    model: "testimonial",
    schema: "testimonialSchema",
    fieldsCreate:
      "name: d.name, role: d.role || null, company: d.company || null, content: d.content, rating: d.rating ?? 5, avatarUrl: d.avatarUrl || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0",
  },
  {
    name: "faqs",
    model: "fAQ",
    schema: "faqSchema",
    fieldsCreate:
      "question: d.question, answer: d.answer, category: d.category || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0",
  },
  {
    name: "offers",
    model: "offer",
    schema: "offerSchema",
    fieldsCreate:
      "title: d.title, description: d.description || null, imageUrl: d.imageUrl || null, discountText: d.discountText || null, linkUrl: d.linkUrl || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0",
  },
  {
    name: "services",
    model: "service",
    schema: "serviceSchema",
    fieldsCreate:
      "title: d.title, description: d.description || null, iconUrl: d.iconUrl || null, imageUrl: d.imageUrl || null, isActive: d.isActive ?? true, sortOrder: d.sortOrder ?? 0",
  },
];

for (const e of entities) {
  write(
    `src/app/api/admin/${e.name}/route.ts`,
    `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { ${e.schema} } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(await prisma.${e.model}.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = ${e.schema}.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(await prisma.${e.model}.create({ data: { storeId, ${e.fieldsCreate} } }), { status: 201 });
}
`
  );

  write(
    `src/app/api/admin/${e.name}/[id]/route.ts`,
    `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { ${e.schema} } from "@/lib/validations";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = ${e.schema}.partial().safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.${e.model}.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  return jsonOk(await prisma.${e.model}.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.${e.model}.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  await prisma.${e.model}.delete({ where: { id } });
  return jsonOk({ ok: true });
}
`
  );
}

write(
  "src/app/api/admin/gallery/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
  publicId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const category = req.nextUrl.searchParams.get("category") || undefined;
  return jsonOk(
    await prisma.galleryImage.findMany({
      where: { storeId, ...(category ? { category } : {}) },
      orderBy: { sortOrder: "asc" },
    })
  );
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = gallerySchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  return jsonOk(
    await prisma.galleryImage.create({
      data: {
        storeId,
        title: d.title || null,
        imageUrl: d.imageUrl,
        publicId: d.publicId || null,
        category: d.category || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    }),
    { status: 201 }
  );
}
`
);

write(
  "src/app/api/admin/gallery/[id]/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  publicId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = gallerySchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.galleryImage.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  return jsonOk(await prisma.galleryImage.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const existing = await prisma.galleryImage.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  await prisma.galleryImage.delete({ where: { id } });
  return jsonOk({ ok: true });
}
`
);

write(
  "src/app/api/admin/contact/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { contactDetailsSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  return jsonOk(await prisma.contactDetails.findUnique({ where: { storeId } }));
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const parsed = contactDetailsSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const storeId = session!.user.storeId || (await getStoreId());
  const d = parsed.data;
  const item = await prisma.contactDetails.upsert({
    where: { storeId },
    create: { storeId, ...d, emailSecondary: d.emailSecondary || null },
    update: { ...d, emailSecondary: d.emailSecondary || null },
  });
  return jsonOk(item);
}
`
);

write(
  "src/app/api/admin/homepage/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const blockSchema = z.object({
  key: z.string().min(1),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const [blocks, settings, logos] = await Promise.all([
    prisma.homepageBlock.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany({ where: { storeId } }),
    prisma.clientLogo.findMany({ where: { storeId }, orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonOk({ blocks, settings, logos });
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const body = await req.json();
  const blocks = Array.isArray(body.blocks) ? body.blocks : [body];
  const results = [];
  for (const raw of blocks) {
    const parsed = blockSchema.safeParse(raw);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid block");
    const d = parsed.data;
    const item = await prisma.homepageBlock.upsert({
      where: { storeId_key: { storeId, key: d.key } },
      create: {
        storeId,
        key: d.key,
        title: d.title || null,
        subtitle: d.subtitle || null,
        body: d.body || null,
        imageUrl: d.imageUrl || null,
        linkUrl: d.linkUrl || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
      update: {
        title: d.title || null,
        subtitle: d.subtitle || null,
        body: d.body || null,
        imageUrl: d.imageUrl || null,
        linkUrl: d.linkUrl || null,
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder ?? 0,
      },
    });
    results.push(item);
  }
  return jsonOk(results);
}
`
);

write(
  "src/app/api/admin/inquiries/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { InquiryStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const storeId = session!.user.storeId || (await getStoreId());
  const status = req.nextUrl.searchParams.get("status") as InquiryStatus | null;
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const pageSize = Math.min(100, Number(req.nextUrl.searchParams.get("pageSize") || 20));
  const where = { storeId, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactInquiry.count({ where }),
  ]);
  return jsonOk({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
`
);

write(
  "src/app/api/admin/inquiries/[id]/route.ts",
  `import { NextRequest } from "next/server";
import { requireAdmin, jsonOk, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/lib/store";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const storeId = session!.user.storeId || (await getStoreId());
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || "Invalid");
  const existing = await prisma.contactInquiry.findFirst({ where: { id, storeId } });
  if (!existing) return jsonError("Not found", 404);
  return jsonOk(await prisma.contactInquiry.update({ where: { id }, data: parsed.data }));
}
`
);

console.log("all done");
