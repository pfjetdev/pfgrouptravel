import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Enterprise & Corporate Travel Solutions | Priority Flyers",
  description: "Dedicated B2B group travel solutions for corporations, sports teams, and educational institutions. Access to 500+ airlines with personalized account management and flexible payment terms.",
  keywords: "corporate travel, group bookings, enterprise travel, charter flights, business travel solutions, B2B travel",
}

export default function B2BLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
