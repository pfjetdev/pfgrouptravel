"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

const navItems = [
  { title: "Home", href: "/" },
  { title: "News", href: "/news" },
  { title: "Practical Information", href: "/practical-information" },
  { title: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 z-50 mx-auto w-full px-4 transition-all duration-300 ${
        isScrolled ? "top-0 max-w-7xl" : "top-4 max-w-6xl"
      }`}
    >
      <nav
        className="flex items-center justify-between rounded-full border bg-background/95 px-6 py-3 shadow-lg backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-background/60"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/black-logo.svg"
            alt="Priority Flyers"
            width={150}
            height={20}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Phone Number */}
          <a
            href="tel:+14158542675"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            <span>+1-415-854-2675</span>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+14158542675"
            className="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground"
          >
            <Phone className="h-5 w-5" />
          </a>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <div className="flex flex-col gap-1.5">
                  <span className="h-0.5 w-5 bg-foreground rounded-full" />
                  <span className="h-0.5 w-5 bg-foreground rounded-full" />
                </div>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] p-0 [&>button]:hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <Image
                  src="/black-logo.svg"
                  alt="Priority Flyers"
                  width={120}
                  height={16}
                />
                <SheetClose asChild>
                  <button className="p-2 rounded-full hover:bg-muted transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-4 text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Phone */}
              <div className="px-6 py-4 border-t">
                <a
                  href="tel:+14158542675"
                  className="flex items-center gap-3 text-base font-medium text-primary"
                >
                  <Phone className="h-5 w-5" />
                  +1-415-854-2675
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
