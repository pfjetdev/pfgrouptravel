"use client"

import * as React from "react"
import { Check, Search, Plane, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

import airportsData from "@/data/airports.json"

interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

const airports: Airport[] = airportsData

const popularAirports = [
  "JFK", "LAX", "LHR", "CDG", "DXB", "SIN", "HKG", "NRT", "SFO", "ORD",
  "MIA", "AMS", "FRA", "IST", "BCN", "FCO", "SYD", "BKK", "ICN", "DEL"
]

interface MobileAirportPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  variant?: "default" | "input"
}

// Helper to format airport for display and storage
const formatAirport = (airport: Airport) => `${airport.iata} - ${airport.city}, ${airport.country}`

// Helper to extract IATA code from formatted string
const extractIata = (value: string) => value?.split(' - ')[0] || value

export function MobileAirportPicker({
  value,
  onChange,
  placeholder = "ex. Amsterdam, AMS",
  label,
  variant = "default",
}: MobileAirportPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Extract IATA code from value (handles both "BCN" and "BCN - Barcelona, Spain" formats)
  const iataCode = extractIata(value)

  const selectedAirport = React.useMemo(
    () => airports.find((airport) => airport.iata === iataCode),
    [iataCode]
  )

  const filteredAirports = React.useMemo(() => {
    if (!search) {
      return airports.filter((a) => popularAirports.includes(a.iata))
    }

    const searchLower = search.toLowerCase()
    return airports
      .filter(
        (airport) =>
          airport.city.toLowerCase().includes(searchLower) ||
          airport.name.toLowerCase().includes(searchLower) ||
          airport.iata.toLowerCase().includes(searchLower) ||
          airport.country.toLowerCase().includes(searchLower)
      )
      .slice(0, 50)
  }, [search])

  const displayValue = selectedAirport
    ? `${selectedAirport.city}, ${selectedAirport.iata}`
    : null

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {variant === "input" ? (
          <button className="flex h-12 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors hover:bg-accent">
            {displayValue ? (
              <span className="text-foreground">{displayValue}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </button>
        ) : (
          <button className="w-full text-left">
            {displayValue ? (
              <p className="text-lg font-medium text-white">{displayValue}</p>
            ) : (
              <p className="text-lg text-slate-500">{placeholder}</p>
            )}
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle>{label}</DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search city or airport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {search ? "Results" : "Popular Airports"}
          </p>
          <div className="space-y-1">
            {filteredAirports.map((airport) => (
              <button
                key={airport.iata}
                onClick={() => {
                  onChange(formatAirport(airport))
                  setOpen(false)
                  setSearch("")
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  iataCode === airport.iata
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Plane className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{airport.iata}</span>
                    <span className="font-medium truncate">{airport.city}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {airport.name}, {airport.country}
                  </p>
                </div>
                {iataCode === airport.iata && (
                  <Check className="h-5 w-5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
