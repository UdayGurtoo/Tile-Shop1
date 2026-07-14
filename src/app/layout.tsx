import type { Metadata } from "next";
import { NavigationLoader } from "@/components/public/NavigationLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mohit Tiles & Granites | 40 Years of Excellence",
    template: "%s | Mohit Tiles & Granites",
  },
  description:
    "Premium tiles, granites, faucets and sanitaryware in Ghaziabad. Authorized Cera & Somany dealer with 40 years of excellence.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationLoader />
        {children}
      </body>
    </html>
  );
}
