import Link from "next/link";

export function Header({
  logoUrl = "/images/logo.png",
  hasPromo = true,
}: {
  logoUrl?: string;
  hasPromo?: boolean;
}) {
  return (
    <header className={`site-header${hasPromo ? "" : " no-promo"}`}>
      <div className="logo">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Mohit Tiles & Granites" />
        </Link>
      </div>
      <nav className="site-nav">
        <ul>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li className="dropdown">
            <a>Products ▾</a>
            <div className="dropdown-content">
              <Link href="/categories/faucets">Faucets</Link>
              <Link href="/categories/toilets">Toilets</Link>
              <Link href="/categories/granites-marbles">Granites</Link>
              <Link href="/gallery/kitchen">Kitchen</Link>
              <Link href="/products">All Products</Link>
            </div>
          </li>
          <li>
            <Link href="/brands">Our Brands</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
