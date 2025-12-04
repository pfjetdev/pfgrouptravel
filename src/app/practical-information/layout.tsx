import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Practical Information",
  description:
    "Everything you need to know about group flight bookings with Priority Flyers. Learn about booking requirements, baggage policies, and FAQs.",
  openGraph: {
    title: "Practical Information | Priority Flyers",
    description:
      "Everything you need to know about group flight bookings with Priority Flyers. Learn about booking requirements, baggage policies, and FAQs.",
  },
}

export default function PracticalInformationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
