import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    title: "Business & First Class",
    description: "Exclusive rates on premium cabin tickets.",
    image: "https://images.unsplash.com/photo-1540339832862-474599807836?w=800&h=600&fit=crop",
    link: "https://www.priorityflyers.com/",
  },
  {
    title: "Private Jet Charter",
    description: "Ultimate flexibility and privacy for your group.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
    link: "https://pfjet.vercel.app/",
  },
]

export function PremiumServicesSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Other Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Flying solo? We also offer individual flight bookings with exclusive rates
            on business and first class tickets, as well as private jet charters for any occasion.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl h-64"
            >
              {/* Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold">
                  {service.title}
                </h3>
                <p className="mt-1 text-white/80">
                  {service.description}
                </p>
                <div className="mt-3 flex items-center text-sm font-medium">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
