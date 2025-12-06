"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plane, Users, ArrowRight, ArrowLeft, Plus, Loader2, CheckCircle2, X } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AirportCombobox } from "@/components/AirportCombobox"
import { DateRangePicker, SingleDatePicker } from "@/components/DateRangePicker"
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

export function BookingForm() {
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

  // Listen for destination selection from destination cards
  React.useEffect(() => {
    const handleDestinationSelected = async (event: Event) => {
      const customEvent = event as CustomEvent
      const { city } = customEvent.detail

      // Load airports data and find matching airport by city
      try {
        const airportsModule = await import('@/data/airports.json')
        const airports = airportsModule.default

        // Find airport by city name
        const airport = airports.find((a: { city: string }) =>
          a.city.toLowerCase() === city.toLowerCase()
        )

        if (airport) {
          // Set the IATA code (e.g., "JFK" for New York)
          setFlightData(prev => ({
            ...prev,
            to: airport.iata
          }))
        } else {
          // Fallback: just set the city name
          setFlightData(prev => ({
            ...prev,
            to: city
          }))
        }
      } catch (error) {
        console.error('Error loading airports:', error)
        // Fallback: set city name
        setFlightData(prev => ({
          ...prev,
          to: city
        }))
      }
    }

    window.addEventListener('destinationSelected', handleDestinationSelected)

    return () => {
      window.removeEventListener('destinationSelected', handleDestinationSelected)
    }
  }, [])

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

  const isStep1Valid = flightData.from && flightData.to && flightData.departDate && flightData.passengers && flightData.classType
  const isStep2Valid = contactData.name && contactData.phone && contactData.email
  const isMultiCityReady = flightData.from && flightData.to && flightData.departDate && flightData.passengers

  // Handle multi-city navigation
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

  // Handle trip type change
  const handleTripTypeChange = (value: TripType) => {
    if (value === "multicity") {
      if (isMultiCityReady) {
        handleMultiCityClick()
      }
    }
    setFlightData({ ...flightData, tripType: value })
  }

  return (
    <Card
      id="booking-form"
      data-booking-form
      className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-0 scroll-mt-24"
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plane className="h-5 w-5 text-primary" />
          {step === 1 ? "Book Your Group Flight" : "Contact Information"}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <div className={cn("h-1 flex-1 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
          <div className={cn("h-1 flex-1 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 ? (
          <>
            {/* Trip Type */}
            <RadioGroup
              value={flightData.tripType === "multicity" ? "multicity" : flightData.tripType}
              onValueChange={handleTripTypeChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roundtrip" id="roundtrip" />
                <Label htmlFor="roundtrip" className="cursor-pointer text-sm">Round Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneway" id="oneway" />
                <Label htmlFor="oneway" className="cursor-pointer text-sm">One Way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multicity" id="multicity" />
                <Label htmlFor="multicity" className="cursor-pointer text-sm">Multi-City</Label>
              </div>
            </RadioGroup>


            {/* From / To */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>From</Label>
                <AirportCombobox
                  value={flightData.from}
                  onChange={(value) => setFlightData({ ...flightData, from: value })}
                  placeholder="Select origin"
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <AirportCombobox
                  value={flightData.to}
                  onChange={(value) => setFlightData({ ...flightData, to: value })}
                  placeholder="Select destination"
                />
              </div>
            </div>

            {/* Dates */}
            {flightData.tripType === "roundtrip" ? (
              <div className="space-y-2">
                <Label>Travel Dates</Label>
                <DateRangePicker
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
                  placeholder="Select departure & return"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <SingleDatePicker
                  date={flightData.departDate}
                  onDateChange={(date) =>
                    setFlightData({ ...flightData, departDate: date })
                  }
                  placeholder="Select date"
                />
              </div>
            )}

            {/* Passengers & Class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Passengers</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min="10"
                    placeholder="Min 10"
                    className="pl-9"
                    value={flightData.passengers}
                    onChange={(e) => setFlightData({ ...flightData, passengers: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={flightData.classType}
                  onValueChange={(value) => setFlightData({ ...flightData, classType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {flightData.tripType === "multicity" ? (
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleMultiCityClick}
                disabled={!isMultiCityReady}
              >
                Add a Destination
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleNext}
                disabled={!isStep1Valid}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Contact Form */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                id="phone"
                placeholder="Enter phone number"
                value={contactData.phone}
                onChange={(value) => setContactData({ ...contactData, phone: value || '' })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
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
      </CardContent>

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
            <Button onClick={handleSuccessClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
