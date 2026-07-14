import Link from "next/link";
import { formatInr, whatsappLink } from "@/lib/utils";

type ProductCardProps = {
  name: string;
  slug: string;
  price: number | string;
  mrp?: number | string | null;
  discountPercent?: number | string | null;
  imageUrl?: string | null;
  sku?: string | null;
  unit?: string | null;
  whatsapp?: string;
};

export function ProductCard({
  name,
  slug,
  price,
  mrp,
  discountPercent,
  imageUrl,
  sku,
  unit,
  whatsapp = "919818697434",
}: ProductCardProps) {
  const priceN = Number(price);
  const mrpN = mrp != null ? Number(mrp) : null;
  const disc = discountPercent != null ? Number(discountPercent) : null;

  return (
    <article className="item-card">
      <Link href={`/products/${slug}`}>
        <div className="img-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl || "/images/logo.png"} alt={name} loading="lazy" />
        </div>
      </Link>
      <div className="item-info">
        <h3>
          <Link href={`/products/${slug}`}>{name}</Link>
        </h3>
        {sku ? <span style={{ fontSize: 12, color: "#666", fontWeight: 700 }}>{sku}</span> : null}
        {mrpN != null && mrpN > priceN ? <p className="mrp">MRP: {formatInr(mrpN)}</p> : null}
        <p className="offer-price">
          {formatInr(priceN)}
          {unit === "sq ft" ? "/sq ft" : ""}
        </p>
        {disc ? <p className="tag">{Math.round(disc)}% OFF</p> : null}
        <a
          className="btn-wa"
          href={whatsappLink(whatsapp, `Enquiry for ${name}${sku ? ` Code:${sku}` : ""}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          ENQUIRE NOW
        </a>
      </div>
    </article>
  );
}
