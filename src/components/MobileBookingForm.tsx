"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Plus, CalendarDays, ArrowUpDown, Plane, Loader2, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileAirportPicker } from "@/components/MobileAirportPicker"
import { MobilePassengerPicker, MobileClassPicker, MobileDateRangePicker, MobileSingleDatePicker } from "@/components/MobilePickers"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type TripType = "roundtrip" | "oneway" | "multicity"

interface FlightData {
  tripType: TripType
  from: string
  to: string
  departDate: Date | undefined
  returnDate: Date | undefined
  passengers: string
  classType: string
}

interface ContactData {
  name: string
  phone: string
  email: string
}

export function MobileBookingForm() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [flightData, setFlightData] = React.useState<FlightData>({
    tripType: "roundtrip",
    from: "",
    to: "",
    departDate: undefined,
    returnDate: undefined,
    passengers: "",
    classType: "economy",
  })
  const [contactData, setContactData] = React.useState<ContactData>({
    name: "",
    phone: "",
    email: "",
  })

  const handleNext = async () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Submit form to Supabase
      setIsSubmitting(true)
      try {
        const tripTypeMap: Record<TripType, string> = {
          roundtrip: 'roundTrip',
          oneway: 'oneWay',
          multicity: 'multiCity'
        }

        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trip_type: tripTypeMap[flightData.tripType],
            from_airport: flightData.from,
            to_airport: flightData.to,
            departure_date: flightData.departDate?.toISOString().split('T')[0],
            return_date: flightData.returnDate?.toISOString().split('T')[0] || null,
            passengers: parseInt(flightData.passengers),
            cabin_class: flightData.classType,
            full_name: contactData.name,
            phone: contactData.phone,
            email: contactData.email,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setShowSuccess(true)
        } else {
          alert(result.error || "Something went wrong. Please try again.")
        }
      } catch (error) {
        console.error('Submission error:', error)
        alert("Failed to submit. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setStep(1)
    setFlightData({
      tripType: "roundtrip",
      from: "",
      to: "",
      departDate: undefined,
      returnDate: undefined,
      passengers: "",
      classType: "economy",
    })
    setContactData({ name: "", phone: "", email: "" })
  }

  const swapAirports = () => {
    setFlightData({
      ...flightData,
      from: flightData.to,
      to: flightData.from,
    })
  }

  const isStep1Valid = flightData.from && flightData.to && flightData.departDate && flightData.passengers && flightData.classType
  const isStep2Valid = contactData.name && contactData.phone && contactData.email
  const isMultiCityReady = flightData.from && flightData.to && flightData.departDate && flightData.passengers

  const handleMultiCityClick = () => {
    if (isMultiCityReady) {
      const params = new URLSearchParams({
        from: flightData.from,
        to: flightData.to,
        date: flightData.departDate!.toISOString(),
        passengers: flightData.passengers,
        class: flightData.classType,
      })
      router.push(`/multi-city?${params.toString()}`)
    }
  }

  const tripTypes: { value: TripType; label: string }[] = [
    { value: "roundtrip", label: "Round Trip" },
    { value: "oneway", label: "One Way" },
    { value: "multicity", label: "Multi-City" },
  ]

  return (
    <div className="w-full space-y-4">
      {step === 1 ? (
        <>
          {/* Trip Type Pills */}
          <div className="flex gap-2">
            {tripTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFlightData({ ...flightData, tripType: type.value })}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                  flightData.tripType === type.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary/50"
                )}
              >
                <Plane className="h-3.5 w-3.5" />
                {type.label}
              </button>
            ))}
          </div>

          {/* Airport Selection Card */}
          <div className="relative rounded-2xl bg-slate-900 p-4">
            {/* From */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400">From</span>
              <MobileAirportPicker
                value={flightData.from}
                onChange={(value) => setFlightData({ ...flightData, from: value })}
                placeholder="ex. Amsterdam, AMS"
                label="Select Origin"
              />
            </div>

            {/* Swap Button */}
            <button
              onClick={swapAirports}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <ArrowUpDown className="h-4 w-4 text-slate-600" />
            </button>

            {/* Divider */}
            <div className="my-3 border-t border-slate-700" />

            {/* To */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Going to</span>
              <MobileAirportPicker
                value={flightData.to}
                onChange={(value) => setFlightData({ ...flightData, to: value })}
                placeholder="ex. London, LHR"
                label="Select Destination"
              />
            </div>
          </div>

          {/* Date, Passengers, Class Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Date */}
            {flightData.tripType === "roundtrip" ? (
              <MobileDateRangePicker
                dateRange={
                  flightData.departDate
                    ? { from: flightData.departDate, to: flightData.returnDate }
                    : undefined
                }
                onDateRangeChange={(range) =>
                  setFlightData({
                    ...flightData,
                    departDate: range?.from,
                    returnDate: range?.to,
                  })
                }
              />
            ) : (
              <MobileSingleDatePicker
                date={flightData.departDate}
                onDateChange={(date) =>
                  setFlightData({ ...flightData, departDate: date })
                }
              />
            )}

            {/* Passengers */}
            <MobilePassengerPicker
              value={flightData.passengers}
              onChange={(value) => setFlightData({ ...flightData, passengers: value })}
            />

            {/* Class */}
            <MobileClassPicker
              value={flightData.classType}
              onChange={(value) => setFlightData({ ...flightData, classType: value })}
            />
          </div>

          {/* Action Button */}
          {flightData.tripType === "multicity" ? (
            <Button
              className="w-full rounded-xl py-6 text-base font-semibold"
              onClick={handleMultiCityClick}
              disabled={!isMultiCityReady}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add a destination
            </Button>
          ) : (
            <Button
              className="w-full rounded-xl py-6 text-base font-semibold"
              onClick={handleNext}
              disabled={!isStep1Valid}
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </>
      ) : (
        <>
          {/* Contact Form */}
          <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="m-name">Full Name</Label>
              <Input
                id="m-name"
                placeholder="John Doe"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-phone">Phone Number</Label>
              <Input
                id="m-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-email">Email</Label>
              <Input
                id="m-email"
                type="email"
                placeholder="john@example.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl py-6"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1 rounded-xl py-6"
              onClick={handleNext}
              disabled={!isStep2Valid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Request Submitted!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Thank you, {contactData.name}!</h3>
              <p className="text-muted-foreground">
                Your group flight request has been successfully submitted. Our team will review your request and contact you within 24 hours.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 w-full text-sm space-y-1">
              <p><span className="text-muted-foreground">Route:</span> {flightData.from} → {flightData.to}</p>
              <p><span className="text-muted-foreground">Passengers:</span> {flightData.passengers}</p>
              <p><span className="text-muted-foreground">Email:</span> {contactData.email}</p>
            </div>
            <Button onClick={handleSuccessClose} className="w-full rounded-xl">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
