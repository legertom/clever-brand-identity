import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

// Approved brand fall-backs (the licensed fonts, ABC Arizona Mix and Messina
// Sans, cannot be redistributed by this service).
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading-fallback"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-fallback"
});

export const metadata: Metadata = {
  title: "Clever Brand Identity",
  description:
    "Hosted Clever brand identity guidelines, design tokens, and MCP endpoint for apps, agents, and design reviews."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
