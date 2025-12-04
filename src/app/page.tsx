import { HeroSection } from "@/components/HeroSection"
import { AirlinesMarquee } from "@/components/AirlinesMarquee"
import { DestinationsSection } from "@/components/DestinationsSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { HowItWorksSection } from "@/components/HowItWorksSection"
import { PremiumServicesSection } from "@/components/PremiumServicesSection"
import { AdditionalServicesSection } from "@/components/AdditionalServicesSection"
import { NewsSection } from "@/components/NewsSection"
import { CTASection } from "@/components/CTASection"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AirlinesMarquee />
      <DestinationsSection />
      <AdditionalServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PremiumServicesSection />
      <NewsSection />
      <CTASection />
    </div>
  );
}
