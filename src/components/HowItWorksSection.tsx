import { FileText, Search, CreditCard, Plane, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const steps = [
  {
    step: 1,
    icon: FileText,
    title: "Submit Your Request",
    description:
      "Fill out our simple form with your travel details: destinations, dates, and group size.",
  },
  {
    step: 2,
    icon: Search,
    title: "We Find Best Options",
    description:
      "Our experts search 500+ airlines to find the best routes and prices for your group.",
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Review & Book",
    description:
      "Receive a custom quote within 2 hours. Choose your preferred flight and book.",
  },
  {
    step: 4,
    icon: Plane,
    title: "Fly Together",
    description:
      "Get your e-tickets, enjoy dedicated support, and travel with peace of mind.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Booking group flights has never been easier. Four simple steps to get your team in the air.
          </p>
        </div>

        {/* Steps - Desktop */}
        <div className="mt-16 hidden lg:block">
          {/* Connection line */}
          <div className="relative">
            <div className="absolute top-16 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />

            <div className="grid grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div key={step.step} className="relative flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative z-10">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-primary/10">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-primary">
                      <span className="text-lg font-bold text-primary">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-16 right-0 z-20 translate-x-1/2 -translate-y-1/2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps - Mobile/Tablet */}
        <div className="mt-12 lg:hidden">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-primary/20" />

            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.step} className="relative flex gap-6">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-primary/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-primary">
                      <span className="text-xs font-bold text-primary">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
