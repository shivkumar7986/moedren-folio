import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Moedren | Premium Editorial Portfolio",
  description:
    "A cinematic digital showcase of design, development, and editorial storytelling. Inspired by aesthetic grids and modern brutalism.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
    title: "Moedren | Premium Editorial Portfolio",
    description:
      "A cinematic digital showcase of design, development, and editorial storytelling.",
    siteName: "Moedren Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-bg text-fg min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
