import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Ready to Book Your Group Flight?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Get a custom quote within 2 hours. Our team is ready to help you plan
          the perfect trip for your group.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="min-w-[200px] text-base"
          >
            <Link href="/#booking-form">
              Get a Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-[200px] border-white bg-transparent text-base text-white hover:bg-white hover:text-primary"
          >
            <a href="tel:+14158542675">
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </a>
          </Button>
        </div>

        <p className="mt-6 text-sm text-white/60">
          No commitment required. Free quotes for groups of 10+ passengers.
        </p>
      </div>
    </section>
  )
}
