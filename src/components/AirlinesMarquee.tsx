import Image from "next/image"

const airlines = [
  "American Airlines",
  "United Airlines",
  "Delta Air Lines",
  "British Airways",
  "Lufthansa",
  "Air France",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
  "KLM",
  "Turkish Airlines",
  "Swiss International Air Lines",
  "Cathay Pacific",
  "Japan Airlines",
  "Air Canada",
  "Qantas",
  "EtihadAirways",
  "Korean Air",
  "Finnair",
  "SAS",
]

export function AirlinesMarquee() {
  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by travelers worldwide • 500+ airline partners
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Marquee Track */}
        <div className="flex animate-marquee">
          {/* Repeat sets for seamless loop */}
          {[0, 1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex shrink-0 items-center gap-8 sm:gap-16 md:gap-24 px-4 sm:px-8 md:px-12">
              {airlines.map((airline) => (
                <div
                  key={`${airline}-${setIndex}`}
                  className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={`/airlines/${airline}.svg`}
                    alt={airline}
                    width={180}
                    height={60}
                    className="w-[100px] sm:w-[140px] md:w-[180px] h-auto min-h-[30px] sm:min-h-[40px]"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
