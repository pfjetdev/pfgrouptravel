"use client"

import * as React from "react"
import { Check, Search, Plane, X } from "lucide-react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"
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

const formatAirport = (airport: Airport) => `${airport.iata} - ${airport.city}, ${airport.country}`
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
  const [mounted, setMounted] = React.useState(false)
  const [dragY, setDragY] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const dragStartY = React.useRef(0)

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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (open) {
      setDragY(0)
    }
  }, [open])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleClose = () => {
    // Blur input to close keyboard
    inputRef.current?.blur()
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
    setOpen(false)
    setSearch("")
    setDragY(0)
  }

  const handleSelect = (airport: Airport) => {
    onChange(formatAirport(airport))
    handleClose()
  }

  // Drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY.current
    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    // Close if dragged more than 100px
    if (dragY > 100) {
      handleClose()
    } else {
      setDragY(0)
    }
  }

  const sheet = (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ opacity: open ? Math.max(0, 0.5 - dragY / 400) : 0 }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 h-[90%] bg-background rounded-t-2xl shadow-xl flex flex-col",
          !isDragging && "transition-transform duration-300 ease-out",
          !open && !isDragging && "translate-y-full"
        )}
        style={{
          transform: open ? `translateY(${dragY}px)` : undefined,
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header - also draggable */}
        <div
          className="px-4 pb-3 border-b touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{label}</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search city or airport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {search ? "Results" : "Popular Airports"}
          </p>
          <div className="space-y-1">
            {filteredAirports.map((airport) => (
              <button
                key={airport.iata}
                onClick={() => handleSelect(airport)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors active:scale-[0.98]",
                  iataCode === airport.iata
                    ? "bg-primary/10"
                    : "hover:bg-muted active:bg-muted"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
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
          <div className="h-8" />
        </div>
      </div>
    </>
  )

  return (
    <>
      {variant === "input" ? (
        <button
          onClick={() => setOpen(true)}
          className="flex h-12 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors hover:bg-accent"
        >
          {displayValue ? (
            <span className="text-foreground">{displayValue}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      ) : (
        <button onClick={() => setOpen(true)} className="w-full text-left">
          {displayValue ? (
            <p className="text-lg font-medium text-white">{displayValue}</p>
          ) : (
            <p className="text-lg text-slate-500">{placeholder}</p>
          )}
        </button>
      )}

      {mounted && createPortal(sheet, document.body)}
    </>
  )
}
