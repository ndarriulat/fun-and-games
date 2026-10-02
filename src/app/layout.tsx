import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body-face" });

export const metadata: Metadata = {
  title: "Vamos",
  description: "Trivia, puzzles and conversation starters for long trips with friends.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3F4FA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
