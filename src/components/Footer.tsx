import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

const navigationLinks = [
  { title: "Home", href: "/" },
  { title: "News", href: "/news" },
  { title: "Practical Information", href: "/practical-information" },
  { title: "Contact", href: "/contact" },
]

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms of Service", href: "/terms-of-service" },
  { title: "Cookie Policy", href: "/cookie-policy" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid gap-8 md:gap-12 grid-cols-2 md:grid-cols-3">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/white-logo.svg"
                alt="Priority Flyers"
                width={150}
                height={20}
              />
            </Link>
            <p className="mt-4 text-sm text-background/70 max-w-xs mx-auto md:mx-0">
              Your trusted partner for group flight bookings. We specialize in corporate travel,
              charter flights, and premium travel services worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left">
            <h3 className="mb-3 md:mb-4 text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="mb-3 md:mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="tel:+14158542675"
                  className="inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+1-415-854-2675</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@priorityflyers.com"
                  className="inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>info@priorityflyers.com</span>
                </a>
              </li>
              <li>
                <div className="inline-flex items-start gap-2 text-sm text-background/70">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>San Francisco, CA<br />United States</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 md:mt-12 border-t border-background/10 pt-6 md:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-xs md:text-sm text-background/50 text-center md:text-left">
              © {new Date().getFullYear()} Priority Flyers. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-xs md:text-sm text-background/50 transition-colors hover:text-primary"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
