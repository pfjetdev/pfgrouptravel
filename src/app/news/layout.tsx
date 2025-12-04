import { Metadata } from "next"

export const metadata: Metadata = {
  title: "News & Travel Tips",
  description:
    "Stay informed with the latest travel trends, expert tips, and exclusive insights for group flight bookings from Priority Flyers.",
  openGraph: {
    title: "News & Travel Tips | Priority Flyers",
    description:
      "Stay informed with the latest travel trends, expert tips, and exclusive insights for group flight bookings from Priority Flyers.",
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
