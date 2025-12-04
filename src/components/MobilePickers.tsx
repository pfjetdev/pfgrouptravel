"use client"

import * as React from "react"
import { Users, Minus, Plus, Check, CalendarDays } from "lucide-react"
import { format, addDays } from "date-fns"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Passenger Picker
interface MobilePassengerPickerProps {
  value: string
  onChange: (value: string) => void
  variant?: "default" | "input"
  label?: string
  minValue?: number
}

export function MobilePassengerPicker({ value, onChange, variant = "default", label = "Passengers", minValue = 10 }: MobilePassengerPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [count, setCount] = React.useState(value ? parseInt(value) : minValue)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => Math.max(minValue, c - 1))

  const handleConfirm = () => {
    onChange(count.toString())
    setOpen(false)
  }

  React.useEffect(() => {
    if (value) {
      setCount(parseInt(value))
    }
  }, [value])

  const displayValue = value ? `${value}+` : `${minValue}+`

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {variant === "input" ? (
          <button className="flex h-12 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors hover:bg-accent">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            {value ? (
              <span className="text-foreground">{value}</span>
            ) : (
              <span className="text-muted-foreground">Select</span>
            )}
          </button>
        ) : (
          <button className="flex flex-col items-center gap-1 rounded-xl border bg-white p-3 text-center transition-colors hover:border-primary/50">
            <Users className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-medium text-foreground">{displayValue}</span>
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Number of {label}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={decrement}
              disabled={count <= minValue}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <Minus className="h-5 w-5" />
            </button>
            <div className="text-center">
              <span className="text-5xl font-bold text-foreground">{count}</span>
              <p className="mt-1 text-sm text-muted-foreground">{label.toLowerCase()}</p>
            </div>
            <button
              onClick={increment}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Minimum {minValue} {label.toLowerCase()} for group booking
          </p>
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="w-full">
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// Class Picker
interface MobileClassPickerProps {
  value: string
  onChange: (value: string) => void
}

const classOptions = [
  { value: "economy", label: "Economy", description: "Standard seating" },
  { value: "business", label: "Business", description: "Extra comfort & amenities" },
  { value: "first", label: "First Class", description: "Premium luxury experience" },
]

export function MobileClassPicker({ value, onChange }: MobileClassPickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedClass = classOptions.find((c) => c.value === value)
  const displayValue = selectedClass?.label || "Economy"

  const handleSelect = (classValue: string) => {
    onChange(classValue)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="flex flex-col items-center gap-1 rounded-xl border bg-white p-3 text-center transition-colors hover:border-primary/50">
          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h.01M12 12h.01M18 12h.01" />
          </svg>
          <span className="text-xs text-muted-foreground">Class</span>
          <span className="text-xs font-medium text-foreground">{displayValue}</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Class</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {classOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
                value === option.value
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-primary/50"
              )}
            >
              <div>
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              {value === option.value && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Date Range Picker for Round Trip
interface MobileDateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  variant?: "default" | "input"
}

export function MobileDateRangePicker({ dateRange, onDateRangeChange, variant = "default" }: MobileDateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const displayValue = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "d")}-${format(dateRange.to, "d MMM")}`
      : format(dateRange.from, "d MMM")
    : "Select"

  const inputDisplayValue = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
      : format(dateRange.from, "MMM d, yyyy")
    : null

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {variant === "input" ? (
          <button className="flex h-12 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors hover:bg-accent">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            {inputDisplayValue ? (
              <span className="text-foreground">{inputDisplayValue}</span>
            ) : (
              <span className="text-muted-foreground">Select dates</span>
            )}
          </button>
        ) : (
          <button className="flex flex-col items-center gap-1 rounded-xl border bg-white p-3 text-center transition-colors hover:border-primary/50">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-muted-foreground">Date</span>
            <span className="whitespace-nowrap text-[11px] font-medium text-foreground">{displayValue}</span>
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Select Travel Dates</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto px-4 pb-2">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from || new Date()}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
            className="w-full rounded-md [&_table]:w-full [&_td]:p-0 [&_th]:p-0 [&_.rdp-cell]:h-12 [&_.rdp-cell]:w-full [&_.rdp-day]:h-12 [&_.rdp-day]:w-full [&_.rdp-head_th]:w-full [&_.rdp-caption]:px-0"
          />
        </div>
        {dateRange?.from && (
          <div className="border-t px-4 py-3 text-center text-sm text-muted-foreground">
            {dateRange.to ? (
              <span>
                <span className="font-medium text-foreground">
                  {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                </span>
              </span>
            ) : (
              <span>Select return date</span>
            )}
          </div>
        )}
        <DrawerFooter>
          <Button
            onClick={() => setOpen(false)}
            className="w-full"
            disabled={!dateRange?.from}
          >
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// Single Date Picker for One Way
interface MobileSingleDatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  variant?: "default" | "input"
}

export function MobileSingleDatePicker({ date, onDateChange, variant = "default" }: MobileSingleDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const displayValue = date ? format(date, "d MMM") : "Select"
  const inputDisplayValue = date ? format(date, "MMM d, yyyy") : null

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {variant === "input" ? (
          <button className="flex h-12 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors hover:bg-accent">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            {inputDisplayValue ? (
              <span className="text-foreground">{inputDisplayValue}</span>
            ) : (
              <span className="text-muted-foreground">Select date</span>
            )}
          </button>
        ) : (
          <button className="flex flex-col items-center gap-1 rounded-xl border bg-white p-3 text-center transition-colors hover:border-primary/50">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-muted-foreground">Date</span>
            <span className="whitespace-nowrap text-[11px] font-medium text-foreground">{displayValue}</span>
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Select Departure Date</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto px-4 pb-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate)
            }}
            disabled={(d) => d < new Date()}
            defaultMonth={date || new Date()}
            className="w-full rounded-md [&_table]:w-full [&_td]:p-0 [&_th]:p-0 [&_.rdp-cell]:h-12 [&_.rdp-cell]:w-full [&_.rdp-day]:h-12 [&_.rdp-day]:w-full [&_.rdp-head_th]:w-full [&_.rdp-caption]:px-0"
          />
        </div>
        {date && (
          <div className="border-t px-4 py-3 text-center text-sm">
            <span className="font-medium text-foreground">
              {format(date, "MMMM d, yyyy")}
            </span>
          </div>
        )}
        <DrawerFooter>
          <Button
            onClick={() => setOpen(false)}
            className="w-full"
            disabled={!date}
          >
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
