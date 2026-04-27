import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parcel Pulse Cargo | International Courier and Cargo Delivery",
  description:
    "UK based international courier company moving parcels, documents, commercial cargo, and specialist shipments worldwide.",
  metadataBase: new URL("https://parcelpulsecargo.com"),
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Parcel Pulse Cargo",
    description:
      "UK based international courier company moving parcels, documents, commercial cargo, and specialist shipments worldwide.",
    url: "https://parcelpulsecargo.com",
    siteName: "Parcel Pulse Cargo",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Parcel Pulse Cargo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parcel Pulse Cargo",
    description:
      "UK based international courier company moving parcels, documents, commercial cargo, and specialist shipments worldwide.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
