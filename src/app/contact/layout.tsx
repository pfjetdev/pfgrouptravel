import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Priority Flyers for group flight bookings, corporate travel, or charter flights. Our team responds within 24 hours.",
  openGraph: {
    title: "Contact Us | Priority Flyers",
    description:
      "Get in touch with Priority Flyers for group flight bookings, corporate travel, or charter flights. Our team responds within 24 hours.",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
