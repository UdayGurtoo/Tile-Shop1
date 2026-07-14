"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Header({
  logoUrl = "/images/mtg-logo.svg",
  hasPromo = true,
}: {
  logoUrl?: string;
  hasPromo?: boolean;
}) {
  const finalLogo = !logoUrl || logoUrl === "/images/logo.png" ? "/images/mtg-logo.svg" : logoUrl;
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className={`site-header${hasPromo ? "" : " no-promo"}`}>
      <div className="logo">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={finalLogo} alt="Mohit Tiles & Granites" />
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
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <div className="mobile-dropdown-group">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className="mobile-dropdown-btn"
            >
              Products {productsOpen ? "▴" : "▾"}
            </button>
            {productsOpen && (
              <div className="mobile-sub-links">
                <Link href="/categories/faucets" onClick={() => setMenuOpen(false)}>
                  Faucets
                </Link>
                <Link href="/categories/toilets" onClick={() => setMenuOpen(false)}>
                  Toilets
                </Link>
                <Link href="/categories/granites-marbles" onClick={() => setMenuOpen(false)}>
                  Granites
                </Link>
                <Link href="/gallery/kitchen" onClick={() => setMenuOpen(false)}>
                  Kitchen
                </Link>
                <Link href="/products" onClick={() => setMenuOpen(false)}>
                  All Products
                </Link>
              </div>
            )}
          </div>
          <Link href="/brands" onClick={() => setMenuOpen(false)}>
            Our Brands
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
