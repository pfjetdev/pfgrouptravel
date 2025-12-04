"use client"

import * as React from "react"
import Image from "next/image"
import { Hotel, Car, Users, MapPin, ArrowRight, ArrowLeft, Check, CalendarDays, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AirportCombobox } from "@/components/AirportCombobox"
import { DateRangePicker, SingleDatePicker } from "@/components/DateRangePicker"
import { type DateRange } from "react-day-picker"
import { MobileAirportPicker } from "@/components/MobileAirportPicker"
import { MobileDateRangePicker, MobileSingleDatePicker, MobilePassengerPicker } from "@/components/MobilePickers"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ServiceType = "hotel" | "transfer"

interface HotelData {
  destination: string
  dateRange: DateRange | undefined
  guests: string
}

interface TransferData {
  pickup: string
  dropoff: string
  date: Date | undefined
  passengers: string
}

interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

function ServiceForm() {
  const [activeService, setActiveService] = React.useState<ServiceType>("hotel")
  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const [hotelData, setHotelData] = React.useState<HotelData>({
    destination: "",
    dateRange: undefined,
    guests: "",
  })

  const [transferData, setTransferData] = React.useState<TransferData>({
    pickup: "",
    dropoff: "",
    date: undefined,
    passengers: "",
  })

  const [contactData, setContactData] = React.useState<ContactData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const isHotelStep1Valid = hotelData.destination && hotelData.dateRange?.from && hotelData.guests
  const isTransferStep1Valid = transferData.pickup && transferData.dropoff && transferData.date && transferData.passengers
  const isStep1Valid = activeService === "hotel" ? isHotelStep1Valid : isTransferStep1Valid
  const isStep2Valid = contactData.firstName && contactData.lastName && contactData.email && contactData.phone

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = activeService === 'hotel'
        ? {
            service_type: 'hotel',
            destination: hotelData.destination,
            check_in_date: hotelData.dateRange?.from?.toISOString().split('T')[0],
            check_out_date: hotelData.dateRange?.to?.toISOString().split('T')[0],
            guests: parseInt(hotelData.guests),
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
          }
        : {
            service_type: 'transfer',
            pickup_location: transferData.pickup,
            dropoff_location: transferData.dropoff,
            transfer_date: transferData.date?.toISOString().split('T')[0],
            passengers: parseInt(transferData.passengers),
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
          }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const resetForm = () => {
    setStep(1)
    setShowSuccess(false)
    setHotelData({ destination: "", dateRange: undefined, guests: "" })
    setTransferData({ pickup: "", dropoff: "", date: undefined, passengers: "" })
    setContactData({ firstName: "", lastName: "", email: "", phone: "" })
  }

  return (
    <>
      {/* Service Tabs */}
      <Tabs
        value={activeService}
        onValueChange={(v) => {
          setActiveService(v as ServiceType)
          setStep(1)
        }}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hotel" className="gap-2">
            <Hotel className="h-4 w-4" />
            Hotel
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-2">
            <Car className="h-4 w-4" />
            Transfer
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Step Indicator */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
            step >= 1
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          1
        </div>
        <div className={`h-0.5 w-8 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
            step >= 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          2
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-3">
            {activeService === "hotel" ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm">Destination</Label>
                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <AirportCombobox
                      value={hotelData.destination}
                      onChange={(value) => setHotelData({ ...hotelData, destination: value })}
                      placeholder="Select city"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <MobileAirportPicker
                      value={hotelData.destination}
                      onChange={(value) => setHotelData({ ...hotelData, destination: value })}
                      placeholder="Select city"
                      label="Select Destination"
                      variant="input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Check-in / Check-out</Label>
                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <DateRangePicker
                      dateRange={hotelData.dateRange}
                      onDateRangeChange={(range) => setHotelData({ ...hotelData, dateRange: range })}
                      placeholder="Select dates"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <MobileDateRangePicker
                      dateRange={hotelData.dateRange}
                      onDateRangeChange={(range) => setHotelData({ ...hotelData, dateRange: range })}
                      variant="input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Number of Guests</Label>
                  {/* Desktop */}
                  <div className="hidden sm:block relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="e.g., 20"
                      min="1"
                      className="pl-10 h-9 text-sm"
                      value={hotelData.guests}
                      onChange={(e) => setHotelData({ ...hotelData, guests: e.target.value })}
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <MobilePassengerPicker
                      value={hotelData.guests}
                      onChange={(value) => setHotelData({ ...hotelData, guests: value })}
                      variant="input"
                      label="Guests"
                      minValue={1}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm">Pickup Location</Label>
                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <AirportCombobox
                      value={transferData.pickup}
                      onChange={(value) => setTransferData({ ...transferData, pickup: value })}
                      placeholder="Select airport"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <MobileAirportPicker
                      value={transferData.pickup}
                      onChange={(value) => setTransferData({ ...transferData, pickup: value })}
                      placeholder="Select airport"
                      label="Select Pickup Location"
                      variant="input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Drop-off Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Hotel or address"
                      className="pl-10 h-12 sm:h-9 text-base sm:text-sm"
                      value={transferData.dropoff}
                      onChange={(e) => setTransferData({ ...transferData, dropoff: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Date</Label>
                    {/* Desktop */}
                    <div className="hidden sm:block">
                      <SingleDatePicker
                        date={transferData.date}
                        onDateChange={(date) => setTransferData({ ...transferData, date })}
                        placeholder="Select date"
                      />
                    </div>
                    {/* Mobile */}
                    <div className="sm:hidden">
                      <MobileSingleDatePicker
                        date={transferData.date}
                        onDateChange={(date) => setTransferData({ ...transferData, date })}
                        variant="input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Passengers</Label>
                    {/* Desktop */}
                    <div className="hidden sm:block">
                      <Input
                        type="number"
                        placeholder="e.g., 20"
                        min="1"
                        className="h-9 text-sm"
                        value={transferData.passengers}
                        onChange={(e) => setTransferData({ ...transferData, passengers: e.target.value })}
                      />
                    </div>
                    {/* Mobile */}
                    <div className="sm:hidden">
                      <MobilePassengerPicker
                        value={transferData.passengers}
                        onChange={(value) => setTransferData({ ...transferData, passengers: value })}
                        variant="input"
                        label="Passengers"
                        minValue={1}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">First Name</Label>
                <Input
                  placeholder="John"
                  value={contactData.firstName}
                  onChange={(e) => setContactData({ ...contactData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={contactData.lastName}
                  onChange={(e) => setContactData({ ...contactData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Phone Number</Label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !isStep2Valid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

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
              <h3 className="font-semibold text-lg">Thank you, {contactData.firstName}!</h3>
              <p className="text-muted-foreground">
                Your {activeService === 'hotel' ? 'hotel' : 'transfer'} request has been successfully submitted. Our team will contact you within 24 hours.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 w-full text-sm space-y-1">
              {activeService === 'hotel' ? (
                <>
                  <p><span className="text-muted-foreground">Destination:</span> {hotelData.destination}</p>
                  <p><span className="text-muted-foreground">Dates:</span> {hotelData.dateRange?.from?.toLocaleDateString()} - {hotelData.dateRange?.to?.toLocaleDateString()}</p>
                  <p><span className="text-muted-foreground">Guests:</span> {hotelData.guests}</p>
                </>
              ) : (
                <>
                  <p><span className="text-muted-foreground">Pickup:</span> {transferData.pickup}</p>
                  <p><span className="text-muted-foreground">Drop-off:</span> {transferData.dropoff}</p>
                  <p><span className="text-muted-foreground">Date:</span> {transferData.date?.toLocaleDateString()}</p>
                  <p><span className="text-muted-foreground">Passengers:</span> {transferData.passengers}</p>
                </>
              )}
              <p className="pt-2 border-t"><span className="text-muted-foreground">Email:</span> {contactData.email}</p>
            </div>
            <Button onClick={resetForm} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function AdditionalServicesSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Content & Form */}
          <div>
            <Badge variant="secondary" className="mb-4">
              Additional Services
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Complete Your Trip
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              Make your group travel hassle-free. We can arrange hotel accommodations
              and airport transfers for your entire group at exclusive rates.
            </p>

            {/* Mobile Image - shown before form on mobile */}
            <div className="relative pb-8 mt-6 lg:hidden">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/hotel.jpg"
                  alt="Luxury hotel for group bookings"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg">
                      <Hotel className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Hotels</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Transfers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-6 right-6 rounded-xl bg-white p-4 shadow-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">500+</p>
                    <p className="text-xs text-muted-foreground">Hotels</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">50+</p>
                    <p className="text-xs text-muted-foreground">Countries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">24/7</p>
                    <p className="text-xs text-muted-foreground">Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <Card className="mt-8 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceForm />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Image (Desktop only) */}
          <div className="relative pb-8 hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/hotel.jpg"
                alt="Luxury hotel for group bookings"
                fill
                className="object-cover"
              />
              {/* Overlay with services */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Services badges on image */}
              <div className="absolute top-4 left-4">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg">
                    <Hotel className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Hotels</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Transfers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />

            {/* Stats card */}
            <div className="absolute -bottom-2 left-6 right-6 rounded-xl bg-white p-4 shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Hotels</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-xs text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
