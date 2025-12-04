"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, Loader2 } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Destination {
  id: string
  city: string
  country: string
  image_url: string
  price: string
}

// Fallback data in case API fails
const fallbackDestinations: Destination[] = [
  {
    id: "1",
    city: "New York",
    country: "USA",
    image_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
    price: "from $299",
  },
  {
    id: "2",
    city: "London",
    country: "United Kingdom",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
    price: "from $349",
  },
  {
    id: "3",
    city: "Paris",
    country: "France",
    image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    price: "from $329",
  },
  {
    id: "4",
    city: "Dubai",
    country: "UAE",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    price: "from $399",
  },
]

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setDestinations(data.length > 0 ? data : fallbackDestinations)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        setDestinations(fallbackDestinations)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Popular Destinations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our most requested group travel destinations. Special rates available for groups of 10+.
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-12 -mr-4 sm:mr-0">
          {loading ? (
            <div className="flex items-center justify-center h-64 sm:h-96">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {destinations.map((destination) => (
                  <CarouselItem key={destination.id} className="pl-2 sm:pl-4 basis-[75%] sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer h-64 sm:h-96">
                      {/* Image */}
                      <Image
                        src={destination.image_url}
                        alt={destination.city}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex items-center gap-1 text-sm text-white/80 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{destination.country}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{destination.city}</h3>
                        <p className="text-primary font-semibold mt-1">{destination.price}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-0 -translate-x-1/2" />
              <CarouselNext className="hidden sm:flex right-0 translate-x-1/2" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}
