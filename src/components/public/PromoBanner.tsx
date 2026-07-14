type Props = {
  text: string;
};

export function PromoBanner({ text }: Props) {
  if (!text) return null;
  return <div className="top-promo-banner">{text}</div>;
}
