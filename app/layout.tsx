import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://erikgoins.com"),
  title: "Erik Goins",
  description: "I help mobile apps make more money.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Erik Goins",
    title: "Erik Goins",
    description: "I help mobile apps make more money.",
    type: "website",
    url: "https://erikgoins.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erik Goins",
    description: "I help mobile apps make more money.",
  },
};

// Tells the browser to paint its own chrome (scrollbar, overscroll canvas) to
// match the active scheme, so dark mode does not leave a light gutter.
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
