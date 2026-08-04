import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://erikgoins.com"),
  title: "Erik Goins",
  description: "Erik Goins Personal Site",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Erik Goins",
    title: "Erik Goins",
    description: "Erik Goins Personal Site",
    type: "website",
    url: "https://erikgoins.com",
    images: [
      {
        url: "/images/card.jpg",
        type: "image/jpeg",
        width: 1280,
        height: 800,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erik Goins",
    description: "Erik Goins Personal Site",
    images: ["/images/card.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
