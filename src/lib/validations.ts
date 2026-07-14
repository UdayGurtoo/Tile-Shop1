import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).optional(),
  sku: z.string().max(100).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  material: z.string().max(100).optional().nullable(),
  finish: z.string().max(100).optional().nullable(),
  color: z.string().max(100).optional().nullable(),
  dimensions: z.string().max(100).optional().nullable(),
  size: z.string().max(100).optional().nullable(),
  thickness: z.string().max(50).optional().nullable(),
  unit: z.string().max(30).optional(),
  mrp: z.coerce.number().nonnegative(),
  price: z.coerce.number().nonnegative(),
  discountPercent: z.coerce.number().min(0).max(100).optional().nullable(),
  stockQuantity: z.coerce.number().int().nonnegative().optional(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  collection: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  specifications: z.record(z.string(), z.unknown()).optional().nullable(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  seoKeywords: z.string().max(300).optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).optional(),
  description: z.string().max(2000).optional().nullable(),
  imageUrl: z.string().max(2000).optional().nullable().or(z.literal("")),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
});

export const brandSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(140).optional(),
  description: z.string().max(2000).optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const contactInquirySchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5).max(5000),
  productId: z.string().optional().nullable(),
});

export const heroBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().nullable(),
  imageUrl: z.string().min(1),
  publicId: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  ctaText: z.string().max(80).optional().nullable(),
  type: z.enum(["HERO", "PROMO", "OFFER", "CATEGORY"]).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  content: z.string().min(5).max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3).max(5000),
  category: z.string().max(100).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const offerSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  discountText: z.string().max(100).optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  iconUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const contactDetailsSchema = z.object({
  businessName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional(),
  phonePrimary: z.string().min(5),
  phoneSecondary: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email(),
  emailSecondary: z.string().email().optional().nullable().or(z.literal("")),
  mapEmbedUrl: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  openDays: z.string().optional(),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  aboutHtml: z.string().optional().nullable(),
  aboutTitle: z.string().optional().nullable(),
  legacyText: z.string().optional().nullable(),
});
