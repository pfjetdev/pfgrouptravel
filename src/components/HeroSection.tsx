import { BookingForm } from "@/components/BookingForm"
import { MobileBookingForm } from "@/components/MobileBookingForm"

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full bg-white md:bg-transparent">
      {/* Background Image - Desktop only */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url('/bg-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:gap-8">
          {/* Left Side - Text (hidden on mobile) */}
          <div className="hidden flex-col justify-center md:flex md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Fly Together,
              <br />
              <span className="text-primary">Save Together</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-black sm:mt-6 sm:text-lg md:text-xl">
              Book group flights for 10+ passengers and unlock exclusive discounts.
              Perfect for corporate travel, sports teams, school trips, and family reunions.
            </p>
            {/* Stats Cards */}
            <div className="mt-6 flex gap-3 sm:mt-8 md:flex-wrap lg:grid lg:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 shadow-md">
                <span className="text-xl font-bold text-primary">10+</span>
                <div>
                  <p className="text-sm font-semibold text-black">Passengers</p>
                  <p className="text-xs text-black/60">Minimum group size</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 shadow-md">
                <span className="text-xl font-bold text-primary">30%</span>
                <div>
                  <p className="text-sm font-semibold text-black">Savings</p>
                  <p className="text-xs text-black/60">Average discount</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 shadow-md">
                <span className="text-xl font-bold text-primary">24/7</span>
                <div>
                  <p className="text-sm font-semibold text-black">Support</p>
                  <p className="text-xs text-black/60">Always available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Hero Content */}
          <div className="flex flex-col md:hidden">
            <h1 className="text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Fly Together,
              <br />
              <span className="text-primary">Save Together</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-center text-sm text-black/80">
              Book group flights for 10+ passengers and unlock exclusive discounts.
            </p>
            <div className="mt-6">
              <MobileBookingForm />
            </div>
          </div>

          {/* Right Side - Desktop Form */}
          <div className="hidden items-center justify-center md:flex lg:justify-end">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  )
}
