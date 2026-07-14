"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop loading when pathname or searchParams change
  useEffect(() => {
    setIsLoading(false);
    setProgress(100);
    const timeout = setTimeout(() => {
      setProgress(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Global click interception on internal links to trigger instant 0ms feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button, [data-href]");
      if (!target) return;

      // Check if it's an anchor link
      const href = target.getAttribute("href") || target.getAttribute("data-href");
      if (!href) return;

      // Ignore external links, new tab clicks, anchor jumps (#), or tel/mailto/whatsapp
      if (
        href.startsWith("http") &&
        !href.includes(window.location.host)
      ) {
        return;
      }
      if (
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.includes("api.whatsapp.com") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // If navigation is to the exact same URL + query, don't trigger loader
      const currentFullUrl = window.location.pathname + window.location.search;
      if (href === currentFullUrl || href === window.location.pathname) {
        return;
      }

      // Add instant visual active feedback to clicked button/card
      target.classList.add("btn-clicked-active");
      setTimeout(() => target.classList.remove("btn-clicked-active"), 800);

      // Start progress bar & floating loader immediately
      setIsLoading(true);
      setProgress(15);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          const increment = prev < 50 ? 12 : prev < 75 ? 5 : 1;
          return prev + increment;
        });
      }, 180);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* Top Glowing Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 999999,
          pointerEvents: "none",
          opacity: progress > 0 && progress < 100 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #FFE57F, #D4AF37, #FFFFFF)",
            boxShadow: "0 0 15px #D4AF37, 0 0 25px #FFE57F, 0 0 5px #fff",
            transition: "width 0.2s ease-out",
            borderRadius: "0 4px 4px 0",
          }}
        />
      </div>

      {/* Floating Instant Feedback Pill */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: isLoading ? "translate(-50%, 0) scale(1)" : "translate(-50%, 30px) scale(0.9)",
          opacity: isLoading ? 1 : 0,
          pointerEvents: "none",
          zIndex: 999998,
          background: "rgba(17, 17, 17, 0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 175, 55, 0.5)",
          color: "#fff",
          padding: "10px 22px",
          borderRadius: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.2)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        <div className="nav-spinner" />
        <span>LOADING...</span>
      </div>

      <style jsx global>{`
        .nav-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-top-color: #D4AF37;
          border-radius: 50%;
          animation: navSpin 0.6s linear infinite;
        }
        @keyframes navSpin {
          to {
            transform: rotate(360deg);
          }
        }
        .btn-clicked-active {
          transform: scale(0.96) !important;
          opacity: 0.85 !important;
          transition: transform 0.15s ease, opacity 0.15s ease !important;
        }
      `}</style>
    </>
  );
}

export function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner />
    </Suspense>
  );
}
