"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plane, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import airportsData from "@/data/airports.json"

interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

const airports: Airport[] = airportsData

// Popular airports to show by default
const popularAirports = [
  "JFK", "LAX", "LHR", "CDG", "DXB", "SIN", "HKG", "NRT", "SFO", "ORD",
  "MIA", "AMS", "FRA", "IST", "BCN", "FCO", "SYD", "BKK", "ICN", "DEL"
]

interface AirportComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

// Helper to format airport for display and storage
const formatAirport = (airport: Airport) => `${airport.iata} - ${airport.city}, ${airport.country}`

// Helper to extract IATA code from formatted string
const extractIata = (value: string) => value?.split(' - ')[0] || value

export function AirportCombobox({
  value,
  onChange,
  placeholder = "Select airport",
  label,
}: AirportComboboxProps) {
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
      // Show popular airports when no search
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
      .slice(0, 50) // Limit results for performance
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10"
        >
          {selectedAirport ? (
            <span className="flex items-center gap-2 truncate">
              <span className="font-semibold text-primary">{selectedAirport.iata}</span>
              <span className="truncate text-muted-foreground">{selectedAirport.city}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search city or airport..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No airport found.</CommandEmpty>
            <CommandGroup heading={search ? "Results" : "Popular Airports"}>
              {filteredAirports.map((airport) => (
                <CommandItem
                  key={airport.iata}
                  value={airport.iata}
                  onSelect={() => {
                    onChange(formatAirport(airport))
                    setOpen(false)
                    setSearch("")
                  }}
                  className="flex items-start gap-3 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{airport.iata}</span>
                      <span className="truncate font-medium">{airport.city}</span>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {airport.name}, {airport.country}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      iataCode === airport.iata ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
