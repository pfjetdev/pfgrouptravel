"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, Loader2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    price: "$299/person",
  },
  {
    id: "2",
    city: "London",
    country: "United Kingdom",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
    price: "$349/person",
  },
  {
    id: "3",
    city: "Paris",
    country: "France",
    image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    price: "$329/person",
  },
  {
    id: "4",
    city: "Dubai",
    country: "UAE",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    price: "$399/person",
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

  const handleDestinationClick = (destination: Destination) => {
    // Store selected destination in sessionStorage
    sessionStorage.setItem('selectedDestination', JSON.stringify({
      city: destination.city,
      country: destination.country
    }))

    // Dispatch custom event to notify booking form
    window.dispatchEvent(new CustomEvent('destinationSelected', {
      detail: {
        city: destination.city,
        country: destination.country
      }
    }))

    // Smooth scroll to booking form - find visible form
    const allBookingForms = document.querySelectorAll('[data-booking-form]')
    let bookingSection: Element | null = null

    // Find the visible form (check element and all parents for display:none)
    // We only check computedStyle.display, not classList, because Tailwind's
    // responsive classes (hidden md:flex) override via media queries
    allBookingForms.forEach((form) => {
      let isVisible = true
      let element: Element | null = form

      // Check element and all parents up the tree
      while (element && element !== document.body) {
        const computedStyle = window.getComputedStyle(element)
        // Only check actual computed display value, not classes
        if (computedStyle.display === 'none') {
          isVisible = false
          break
        }
        element = element.parentElement
      }

      if (isVisible) {
        bookingSection = form
      }
    })

    // Fallback: try to find by ID if no visible form found
    if (!bookingSection) {
      bookingSection = document.querySelector('#booking-form')
    }

    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      // Add highlight animation after scroll
      setTimeout(() => {
        bookingSection?.classList.add('animate-pulse')
        setTimeout(() => {
          bookingSection?.classList.remove('animate-pulse')
        }, 1500)
      }, 800)
    }
  }

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Group Travel
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Top Destinations for Groups
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Perfect for corporate teams, sports groups, and educational trips.
            Get exclusive group rates for 10+ passengers with discounts up to 20%.
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
                    <div
                      onClick={() => handleDestinationClick(destination)}
                      className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer h-64 sm:h-96 transition-all hover:shadow-2xl hover:scale-[1.02]"
                    >
                      {/* Image */}
                      <Image
                        src={destination.image_url}
                        alt={destination.city}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Group Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">
                          <Users className="h-3 w-3 mr-1" />
                          10+ Seats
                        </Badge>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex items-center gap-1 text-sm text-white/80 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{destination.country}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{destination.city}</h3>
                        <div className="mt-2 flex flex-col gap-1">
                          <p className="text-sm text-white/70">Group rate</p>
                          <p className="text-white font-bold text-lg">
                            {destination.price}
                            {!destination.price.includes('/person') && '/person'}
                          </p>
                        </div>
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
