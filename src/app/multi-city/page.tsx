"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plane, Users, Plus, Trash2, ArrowRight, ArrowLeft, Check, Loader2, ArrowUpDown, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AirportCombobox } from "@/components/AirportCombobox"
import { SingleDatePicker } from "@/components/DateRangePicker"
import { MobileAirportPicker } from "@/components/MobileAirportPicker"
import { MobileSingleDatePicker, MobilePassengerPicker, MobileClassPicker } from "@/components/MobilePickers"

interface FlightSegment {
  id: number
  from: string
  to: string
  date: Date | undefined
  passengers: string
  classType: string
}

interface ContactData {
  name: string
  phone: string
  email: string
}

function MultiCityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get initial data from URL params
  const initialFrom = searchParams.get("from") || ""
  const initialTo = searchParams.get("to") || ""
  const initialDate = searchParams.get("date")
  const initialPassengers = searchParams.get("passengers") || ""
  const initialClass = searchParams.get("class") || "economy"

  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [segments, setSegments] = React.useState<FlightSegment[]>([
    {
      id: 1,
      from: initialFrom,
      to: initialTo,
      date: initialDate ? new Date(initialDate) : undefined,
      passengers: initialPassengers,
      classType: initialClass,
    },
    {
      id: 2,
      from: initialTo,
      to: "",
      date: undefined,
      passengers: initialPassengers,
      classType: initialClass,
    },
  ])
  const [contactData, setContactData] = React.useState<ContactData>({
    name: "",
    phone: "",
    email: "",
  })

  // Update Flight 2's "from" when Flight 1's "to" changes
  const updateSegment = (id: number, field: keyof FlightSegment, value: string | Date | undefined) => {
    setSegments((prev) => {
      const updated = prev.map((segment) =>
        segment.id === id ? { ...segment, [field]: value } : segment
      )

      // Auto-fill next flight's "from" when current flight's "to" changes
      if (field === "to") {
        const currentIndex = updated.findIndex((s) => s.id === id)
        if (currentIndex !== -1 && currentIndex < updated.length - 1) {
          updated[currentIndex + 1] = {
            ...updated[currentIndex + 1],
            from: value as string,
          }
        }
      }

      return updated
    })
  }

  const addSegment = () => {
    if (segments.length >= 5) return // Max 5 flights

    const lastSegment = segments[segments.length - 1]
    setSegments([
      ...segments,
      {
        id: Date.now(),
        from: lastSegment.to,
        to: "",
        date: undefined,
        passengers: lastSegment.passengers,
        classType: lastSegment.classType,
      },
    ])
  }

  const removeSegment = (id: number) => {
    if (segments.length <= 2) return // Minimum 2 flights for multi-city
    setSegments((prev) => prev.filter((segment) => segment.id !== id))
  }

  const isStep1Valid =
    segments.every((s) => s.from && s.to && s.date && s.passengers && s.classType)

  const isStep2Valid = contactData.name && contactData.phone && contactData.email

  const handleNext = async () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Submit form to Supabase
      setIsSubmitting(true)
      try {
        const flights = segments.map((s) => ({
          from: s.from,
          to: s.to,
          date: s.date?.toISOString().split('T')[0],
        }))

        const response = await fetch('/api/multi-city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flights,
            passengers: parseInt(segments[0].passengers),
            cabin_class: segments[0].classType,
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

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push('/')
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-b md:from-slate-50 md:to-slate-100">
      <div className="pt-24 pb-20 px-4 md:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl font-bold mb-1 md:text-3xl md:mb-2">Multi-City Flight</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Plan your itinerary with multiple destinations
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 md:gap-4 md:mb-8">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={cn(
                  "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium",
                  step >= 1
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > 1 ? <Check className="h-3.5 w-3.5 md:h-4 md:w-4" /> : "1"}
              </div>
              <span className="text-xs md:text-sm font-medium">Flights</span>
            </div>
            <div className="w-8 md:w-12 h-0.5 bg-muted" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={cn(
                  "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium",
                  step >= 2
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
              <span className="text-xs md:text-sm font-medium">Contact</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4 md:space-y-6">
              {/* Flight Segments */}
              {segments.map((segment, index) => (
                <div key={segment.id}>
                  {/* Mobile Version */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-primary">Flight {index + 1}</span>
                      {segments.length > 2 && (
                        <button
                          onClick={() => removeSegment(segment.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Dark Airport Card */}
                    <div className="relative rounded-2xl bg-slate-900 p-4 mb-3">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400">From</span>
                        <MobileAirportPicker
                          value={segment.from}
                          onChange={(value) => updateSegment(segment.id, "from", value)}
                          placeholder="ex. Amsterdam, AMS"
                          label="Select Origin"
                        />
                      </div>

                      <div className="my-3 border-t border-slate-700" />

                      <div className="space-y-1">
                        <span className="text-xs text-slate-400">Going to</span>
                        <MobileAirportPicker
                          value={segment.to}
                          onChange={(value) => updateSegment(segment.id, "to", value)}
                          placeholder="ex. London, LHR"
                          label="Select Destination"
                        />
                      </div>
                    </div>

                    {/* Date, Passengers & Class Row */}
                    <div className="grid grid-cols-3 gap-2">
                      <MobileSingleDatePicker
                        date={segment.date}
                        onDateChange={(date) => updateSegment(segment.id, "date", date)}
                      />
                      <MobilePassengerPicker
                        value={segment.passengers}
                        onChange={(value) => updateSegment(segment.id, "passengers", value)}
                      />
                      <MobileClassPicker
                        value={segment.classType}
                        onChange={(value) => updateSegment(segment.id, "classType", value)}
                      />
                    </div>

                    {/* Connection indicator */}
                    {index < segments.length - 1 && (
                      <div className="flex items-center justify-center mt-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Plane className="h-3.5 w-3.5 rotate-90" />
                          <span>
                            {segment.to ? `Continue from ${segment.to}` : "Select destination"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Version */}
                  <Card className="relative overflow-hidden hidden md:block">
                    <div className="absolute top-0 left-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-br-lg">
                      Flight {index + 1}
                    </div>

                    {segments.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSegment(segment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <CardContent className="pt-12 pb-6">
                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>From</Label>
                          <AirportCombobox
                            value={segment.from}
                            onChange={(value) => updateSegment(segment.id, "from", value)}
                            placeholder="Select origin"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>To</Label>
                          <AirportCombobox
                            value={segment.to}
                            onChange={(value) => updateSegment(segment.id, "to", value)}
                            placeholder="Select destination"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Date</Label>
                          <SingleDatePicker
                            date={segment.date}
                            onDateChange={(date) => updateSegment(segment.id, "date", date)}
                            placeholder="Select date"
                            minDate={
                              index > 0 && segments[index - 1].date
                                ? segments[index - 1].date
                                : new Date()
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Passengers</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              min="10"
                              placeholder="Min 10"
                              className="pl-9"
                              value={segment.passengers}
                              onChange={(e) => updateSegment(segment.id, "passengers", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Class</Label>
                          <Select
                            value={segment.classType}
                            onValueChange={(value) => updateSegment(segment.id, "classType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="first">First</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {index < segments.length - 1 && (
                        <div className="flex items-center justify-center mt-4 pt-4 border-t border-dashed">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Plane className="h-4 w-4 rotate-90" />
                            <span>
                              {segment.to
                                ? `Continue from ${segment.to}`
                                : "Select destination above"}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Add Flight Button */}
              {segments.length < 5 && (
                <Button
                  variant="outline"
                  className="w-full h-12 md:h-14 border-dashed rounded-xl"
                  onClick={addSegment}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Flight
                </Button>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl py-6 md:py-4"
                  size="lg"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Back to Home</span>
                  <span className="md:hidden">Back</span>
                </Button>
                <Button
                  className="flex-1 rounded-xl py-6 md:py-4"
                  size="lg"
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              {/* Mobile Contact Form */}
              <div className="md:hidden space-y-4">
                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h4 className="font-medium mb-2 text-sm">Your Itinerary</h4>
                  <div className="space-y-2">
                    {segments.map((segment, index) => (
                      <div key={segment.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold">
                            {index + 1}.
                          </span>
                          <span>
                            {segment.from} → {segment.to}
                          </span>
                        </div>
                        <div className="ml-4 text-muted-foreground">
                          {segment.date?.toLocaleDateString()} • {segment.passengers} pax • {segment.classType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm border">
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="m-name">Full Name</Label>
                    <Input
                      id="m-name"
                      placeholder="John Doe"
                      className="rounded-xl"
                      value={contactData.name}
                      onChange={(e) =>
                        setContactData({ ...contactData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="m-phone">Phone Number</Label>
                    <Input
                      id="m-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="rounded-xl"
                      value={contactData.phone}
                      onChange={(e) =>
                        setContactData({ ...contactData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="m-email">Email</Label>
                    <Input
                      id="m-email"
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl"
                      value={contactData.email}
                      onChange={(e) =>
                        setContactData({ ...contactData, email: e.target.value })
                      }
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
              </div>

              {/* Desktop Contact Form */}
              <Card className="hidden md:block">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    We&apos;ll send your custom quote to this contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2">Your Itinerary</h4>
                    <div className="space-y-2 text-sm">
                      {segments.map((segment, index) => (
                        <div key={segment.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-medium">
                              {index + 1}.
                            </span>
                            <span>
                              {segment.from} → {segment.to}
                            </span>
                          </div>
                          <div className="ml-5 text-muted-foreground text-xs">
                            {segment.date?.toLocaleDateString()} • {segment.passengers} pax • {segment.classType}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={contactData.name}
                      onChange={(e) =>
                        setContactData({ ...contactData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={contactData.phone}
                      onChange={(e) =>
                        setContactData({ ...contactData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactData.email}
                      onChange={(e) =>
                        setContactData({ ...contactData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
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
                          Submit Request
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

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
                Your multi-city flight request has been successfully submitted. Our team will review your itinerary and contact you within 24 hours.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 w-full text-sm space-y-2">
              <p className="font-medium">Your Itinerary:</p>
              {segments.map((segment, index) => (
                <p key={segment.id} className="text-muted-foreground">
                  {index + 1}. {segment.from} → {segment.to}
                </p>
              ))}
              <p className="pt-2 border-t"><span className="text-muted-foreground">Passengers:</span> {segments[0]?.passengers}</p>
              <p><span className="text-muted-foreground">Email:</span> {contactData.email}</p>
            </div>
            <Button onClick={handleSuccessClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  )
}

export default function MultiCityPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MultiCityContent />
    </Suspense>
  )
}
