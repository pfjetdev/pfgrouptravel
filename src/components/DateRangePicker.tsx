"use client"

import * as React from "react"
import { addDays, format, differenceInDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const presets = [
  { label: "Weekend", days: 3 },
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
]

interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
  trigger?: React.ReactNode
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  placeholder = "Select dates",
  trigger,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const nights = React.useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInDays(dateRange.to, dateRange.from)
    }
    return 0
  }, [dateRange])

  const handlePreset = (days: number) => {
    const from = addDays(new Date(), 7) // Start a week from now
    const to = addDays(from, days)
    onDateRangeChange({ from, to })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !dateRange && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {dateRange?.from ? (
              dateRange.to ? (
                <span className="flex items-center gap-2 truncate">
                  <span>
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                </span>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* Quick presets */}
        <div className="flex gap-1 p-3 border-b">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="text-xs flex-1"
              onClick={() => handlePreset(preset.days)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Calendar */}
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from || new Date()}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          disabled={(date) => date < new Date()}
        />

        {/* Footer with selection info */}
        {dateRange?.from && (
          <div className="border-t p-3 text-sm text-center text-muted-foreground">
            {dateRange.to ? (
              <span>
                <span className="font-medium text-foreground">{nights} nights</span>
                {" "}selected
              </span>
            ) : (
              <span>Select return date</span>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Single date picker for one-way flights
interface SingleDatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  minDate?: Date
  className?: string
  placeholder?: string
  trigger?: React.ReactNode
}

export function SingleDatePicker({
  date,
  onDateChange,
  minDate,
  className,
  placeholder = "Select date",
  trigger,
}: SingleDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM d, yyyy") : <span>{placeholder}</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate)
            setOpen(false)
          }}
          disabled={(d) => d < (minDate || new Date())}
          defaultMonth={date || minDate || new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
