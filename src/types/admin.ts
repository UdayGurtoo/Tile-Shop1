import type { BannerType, InquiryStatus } from "@prisma/client";

export type ProductImageInput = {
  id?: string;
  url: string;
  publicId?: string | null;
  thumbnailUrl?: string | null;
  alt?: string | null;
  sortOrder?: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  material?: string | null;
  finish?: string | null;
  color?: string | null;
  dimensions?: string | null;
  size?: string | null;
  thickness?: string | null;
  unit: string;
  mrp: number | string;
  price: number | string;
  discountPercent?: number | string | null;
  stockQuantity: number;
  lowStockAt: number;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  sortOrder: number;
  collection?: string | null;
  tags: string[];
  specifications?: Record<string, unknown> | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  images: ProductImageInput[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  _count?: { products: number };
};

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
};

export type AdminBanner = {
  id: string;
  type: BannerType;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  publicId?: string | null;
  linkUrl?: string | null;
  ctaText?: string | null;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type AdminTestimonial = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  avatarUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type AdminFaq = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type AdminOffer = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  discountText?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type AdminService = {
  id: string;
  title: string;
  description?: string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type AdminGalleryImage = {
  id: string;
  title?: string | null;
  imageUrl: string;
  publicId?: string | null;
  category?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type AdminHomepageBlock = {
  id: string;
  key: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  sortOrder: number;
};

export type AdminContactDetails = {
  id: string;
  businessName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  country: string;
  phonePrimary: string;
  phoneSecondary?: string | null;
  whatsapp?: string | null;
  email: string;
  emailSecondary?: string | null;
  mapEmbedUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  openTime: string;
  closeTime: string;
  openDays: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  aboutHtml?: string | null;
  aboutTitle?: string | null;
  legacyText?: string | null;
};

export type AdminInquiry = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  productId?: string | null;
  status: InquiryStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  products: number;
  categories: number;
  newInquiries: number;
  lowStock: number;
};
