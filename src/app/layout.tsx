import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://priorityflyers.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Priority Flyers - Group Flight Booking Specialists",
    template: "%s | Priority Flyers",
  },
  description:
    "Book group flight tickets with Priority Flyers. Specialized in group travel for 10+ passengers with access to 500+ airlines worldwide. Get custom quotes within 24 hours.",
  keywords: [
    "group flight booking",
    "group travel",
    "corporate travel",
    "charter flights",
    "bulk flight tickets",
    "group airfare",
    "business travel",
    "team travel",
    "sports team flights",
    "school group travel",
  ],
  applicationName: "Priority Flyers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Priority Flyers",
  },
  authors: [{ name: "Priority Flyers" }],
  creator: "Priority Flyers",
  publisher: "Priority Flyers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Priority Flyers",
    title: "Priority Flyers - Group Flight Booking Specialists",
    description:
      "Book group flight tickets with Priority Flyers. Specialized in group travel for 10+ passengers with access to 500+ airlines worldwide.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Priority Flyers - Group Flight Booking Specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priority Flyers - Group Flight Booking Specialists",
    description:
      "Book group flight tickets with Priority Flyers. Specialized in group travel for 10+ passengers with access to 500+ airlines worldwide.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Priority Flyers",
  description:
    "Specialized in group flight bookings for 10+ passengers with access to 500+ airlines worldwide.",
  url: siteUrl,
  telephone: "+1-415-854-2675",
  email: "info@priorityflyers.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5419 Palm Ave apt 11",
    addressLocality: "Sacramento",
    addressRegion: "CA",
    postalCode: "95841",
    addressCountry: "US",
  },
  sameAs: [],
  priceRange: "$$",
  openingHours: "Mo-Fr 09:00-18:00",
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  serviceType: [
    "Group Flight Booking",
    "Corporate Travel",
    "Charter Flights",
    "Multi-City Flights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
