import Image from "next/image"
import {
  Users,
  Percent,
  Headphones,
  Plane,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Users,
    title: "Group Discounts",
    description: "Save up to 30% on bookings of 10+ passengers",
  },
  {
    icon: Plane,
    title: "500+ Airlines",
    description: "Access to all major carriers worldwide",
  },
  {
    icon: Shield,
    title: "Flexible Booking",
    description: "Free name changes and easy cancellation",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Personal account manager for your group",
  },
  {
    icon: Clock,
    title: "Quick Quotes",
    description: "Custom quotes within 2 hours",
  },
  {
    icon: Percent,
    title: "Best Price Guarantee",
    description: "We'll match any lower price + 5% extra",
  },
]

const stats = [
  { value: "50K+", label: "Passengers" },
  { value: "500+", label: "Airlines" },
  { value: "98%", label: "Satisfaction" },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/plane.jpg"
                alt="Group of business travelers boarding a plane"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-around rounded-xl bg-white/95 px-4 py-4 shadow-lg backdrop-blur">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
          </div>

          {/* Right Side - Content */}
          <div>
            <Badge variant="secondary" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Priority Flyers?
            </h2>
            <p className="mt-4 text-muted-foreground">
              We specialize in group travel, offering unbeatable prices and
              personalized service for teams, families, and organizations.
            </p>

            {/* Features List */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
