import { OptimizedImage } from "./OptimizedImage";

export type BrandLogo = {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string | null;
};

type Props = {
  logos: BrandLogo[];
};

export function BrandMarquee({ logos }: Props) {
  if (!logos.length) return null;

  const doubled = [...logos, ...logos];

  return (
    <div className="brand-slider-wrap">
      <div className="brand-slider-track">
        {doubled.map((logo, i) => (
          <OptimizedImage
            key={`${logo.id}-${i}`}
            src={logo.imageUrl}
            alt={logo.name}
            width={120}
            height={60}
            className="brand-logo"
            thumbWidth={200}
          />
        ))}
      </div>
    </div>
  );
}
