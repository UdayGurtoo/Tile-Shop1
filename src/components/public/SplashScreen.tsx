"use client";

import { useEffect, useState } from "react";

export function SplashScreen({
  logoUrl = "/images/mtg-logo.svg",
  title = "MOHIT TILES AND GRANITES",
}: {
  logoUrl?: string;
  title?: string;
}) {
  const finalLogo = !logoUrl || logoUrl === "/images/logo.png" ? "/images/mtg-logo.svg" : logoUrl;
  const [hidden, setHidden] = useState(false);
  const [filled, setFilled] = useState<boolean[]>(() => Array(100).fill(false));

  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      setFilled((prev) => {
        const unfilled = prev.map((v, i) => (!v ? i : -1)).filter((i) => i >= 0);
        if (unfilled.length === 0) {
          clearInterval(interval);
          setTimeout(() => {
            if (!cancelled) setHidden(true);
          }, 500);
          return prev;
        }
        const idx = unfilled[Math.floor(Math.random() * unfilled.length)];
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    }, 20);

    const fallback = setTimeout(() => {
      if (!cancelled) setHidden(true);
    }, 2500);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div id="splash-screen" className={hidden ? "splash-hidden" : undefined}>
      <div id="tile-grid">
        {filled.map((isFilled, i) => (
          <div key={i} className={`tile-unit${isFilled ? " filled" : ""}`} />
        ))}
      </div>
      <div className="splash-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={finalLogo} alt="Logo" className="splash-logo" />
        <h2>{title}</h2>
      </div>
    </div>
  );
}
