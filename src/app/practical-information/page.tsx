import {
  Plane,
  Users,
  FileText,
  Luggage,
  CreditCard,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const bookingSteps = [
  {
    step: 1,
    title: "Submit Your Request",
    description:
      "Fill out our group booking form with your travel details, including destinations, dates, and number of passengers.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Receive Custom Quotes",
    description:
      "Our team will prepare personalized quotes from multiple airlines within 24-48 hours.",
    icon: Clock,
  },
  {
    step: 3,
    title: "Review & Confirm",
    description:
      "Compare options, select the best fit for your group, and confirm your booking with a deposit.",
    icon: CheckCircle2,
  },
  {
    step: 4,
    title: "Manage Your Booking",
    description:
      "Add or remove passengers, request special services, and receive your e-tickets before departure.",
    icon: Users,
  },
]

const requirements = [
  {
    title: "Minimum Group Size",
    description: "10 or more passengers traveling together on the same flight",
    icon: Users,
  },
  {
    title: "Advance Booking",
    description: "We recommend booking at least 8-12 weeks before departure for best rates",
    icon: Clock,
  },
  {
    title: "Passenger Information",
    description: "Full names as per passport/ID, dates of birth, and contact details",
    icon: FileText,
  },
  {
    title: "Deposit Required",
    description: "Non-refundable deposit of 10-20% at the time of booking confirmation",
    icon: CreditCard,
  },
]

const baggageInfo = [
  {
    type: "Carry-on Baggage",
    description: "1 piece up to 8kg (17.6 lbs), max dimensions 55x40x23cm",
    included: true,
  },
  {
    type: "Checked Baggage",
    description: "Allowance varies by airline and fare class (typically 23-32kg per piece)",
    included: true,
  },
  {
    type: "Sports Equipment",
    description: "Special handling available for skis, golf clubs, bikes, etc.",
    included: false,
    note: "Additional fees may apply",
  },
  {
    type: "Musical Instruments",
    description: "Small instruments in cabin, larger items may require seat purchase",
    included: false,
    note: "Contact us for arrangements",
  },
  {
    type: "Excess Baggage",
    description: "Pre-purchase additional baggage at discounted group rates",
    included: false,
    note: "Save up to 50% vs airport rates",
  },
]

const faqItems = [
  {
    question: "What qualifies as a group booking?",
    answer:
      "A group booking typically requires a minimum of 10 passengers traveling together on the same flight and route. Some airlines may accept groups as small as 8 passengers, while others require 15+. We work with all major airlines to find the best options for your specific group size.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking 8-12 weeks in advance for domestic flights and 12-16 weeks for international travel. This ensures better availability and pricing. However, we can often accommodate last-minute group requests depending on airline inventory.",
  },
  {
    question: "Can I add or remove passengers after booking?",
    answer:
      "Yes, group bookings offer flexibility to add or remove passengers until the final payment deadline, typically 4-6 weeks before departure. Name changes and additions are usually free of charge, while reductions may be subject to airline policies.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, credit cards (Visa, MasterCard, American Express), and corporate invoicing for established clients. A deposit of 10-20% is required at booking, with the balance due 4-6 weeks before departure.",
  },
  {
    question: "Are meals included in group bookings?",
    answer:
      "Meal inclusion depends on the airline and route. Long-haul flights typically include meals, while short-haul may offer buy-on-board options. We can arrange special meal requests (vegetarian, kosher, halal, etc.) at no additional cost when notified in advance.",
  },
  {
    question: "What happens if our flight is cancelled or delayed?",
    answer:
      "In case of airline-initiated cancellations, you're entitled to a full refund or rebooking at no extra cost. For delays, we work directly with airlines to arrange alternative options. We recommend travel insurance for additional protection against unforeseen circumstances.",
  },
  {
    question: "Can we request specific seating arrangements?",
    answer:
      "Absolutely! Group bookings often come with priority seating allocation. We can arrange block seating to keep your group together, window/aisle preferences, and special requirements for passengers with reduced mobility.",
  },
  {
    question: "Do you offer travel insurance?",
    answer:
      "We partner with leading travel insurance providers to offer comprehensive group coverage, including trip cancellation, medical emergencies, and baggage protection. Ask your booking agent for a quote tailored to your group's needs.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "Cancellation terms vary by airline and fare type. Generally, the deposit is non-refundable, but the remaining amount may be refunded up to 4-6 weeks before departure. We always recommend reviewing the specific terms before confirming your booking.",
  },
  {
    question: "Can you arrange ground transportation and hotels?",
    answer:
      "Yes, we offer complete travel management services including airport transfers, hotel accommodations, and local transportation. Let us know your requirements, and we'll provide a comprehensive package quote.",
  },
]

export default function PracticalInformationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <Badge variant="secondary" className="mb-4">
            Everything You Need to Know
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Practical Information
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Your complete guide to group flight bookings with Priority Flyers.
            Find answers to common questions and learn how we make group travel simple.
          </p>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How Group Booking Works</h2>
            <p className="mt-2 text-muted-foreground">
              Four simple steps to book your group flight
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step) => (
              <Card key={step.step} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary rounded-bl-lg">
                  Step {step.step}
                </div>
                <CardHeader className="pt-10">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Requirements Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Booking Requirements</h2>
            <p className="mt-2 text-muted-foreground">
              What you need to know before making a group booking
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {requirements.map((req) => (
              <Card key={req.title} className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <req.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{req.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{req.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Baggage Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Luggage className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Baggage Information</h2>
            <p className="mt-2 text-muted-foreground">
              Standard allowances and special baggage handling
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {baggageInfo.map((item) => (
              <Card key={item.type} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.type}</CardTitle>
                    {item.included ? (
                      <Badge variant="default" className="bg-green-600">
                        Included
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.note && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <AlertCircle className="h-3 w-3" />
                      {item.note}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">
              Find answers to the most common questions about group bookings
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-foreground py-16 text-background">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Still Have Questions?</h2>
              <p className="mt-4 text-background/70">
                Our team of group travel specialists is here to help. Contact us for
                personalized assistance with your booking.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="tel:+14158542675"
                  className="flex items-center gap-3 text-background/80 transition-colors hover:text-primary"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-background/60">Call us</p>
                    <p className="font-medium">+1-415-854-2675</p>
                  </div>
                </a>
                <a
                  href="mailto:info@priorityflyers.com"
                  className="flex items-center gap-3 text-background/80 transition-colors hover:text-primary"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-background/60">Email us</p>
                    <p className="font-medium">info@priorityflyers.com</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <Card className="w-full max-w-sm bg-background text-foreground">
                <CardHeader>
                  <CardTitle>Ready to Book?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Start your group booking request now and receive a custom quote within 24-48 hours.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild size="lg" className="w-full">
                      <Link href="/#booking-form">Get a Quote</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
