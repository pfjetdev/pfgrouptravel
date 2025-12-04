import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Multi-City Flight Booking",
  description:
    "Book multi-city group flights with Priority Flyers. Plan complex itineraries with multiple destinations for your group of 10+ passengers.",
  openGraph: {
    title: "Multi-City Flight Booking | Priority Flyers",
    description:
      "Book multi-city group flights with Priority Flyers. Plan complex itineraries with multiple destinations for your group of 10+ passengers.",
  },
}

export default function MultiCityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
