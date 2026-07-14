import Link from "next/link";
import { OptimizedImage } from "./OptimizedImage";
import { Reveal } from "./Reveal";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

type Props = {
  title: string;
  categories: CategoryItem[];
  linkPrefix?: string;
};

export function CategoryGrid({ title, categories, linkPrefix = "/categories" }: Props) {
  if (!categories.length) return null;

  return (
    <section className="section">
      <Reveal>
        <h2 className="section-title">{title}</h2>
      </Reveal>
      <div className="category-grid">
        {categories.map((cat) => (
          <Reveal key={cat.id}>
            <Link href={`${linkPrefix}/${cat.slug}`} className="category-card">
              {cat.imageUrl && (
                <OptimizedImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  thumbWidth={600}
                />
              )}
              <div className="category-overlay">
                <h3>{cat.name}</h3>
                <span className="shop-now-btn">Shop Now</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
