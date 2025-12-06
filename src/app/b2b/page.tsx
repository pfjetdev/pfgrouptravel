"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Building2,
  Users,
  GraduationCap,
  Trophy,
  Plane,
  CheckCircle2,
  Shield,
  Clock,
  HeadphonesIcon,
  CreditCard,
  BarChart3,
  Send,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Badge } from "@/components/ui/badge"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"

const industries = [
  {
    icon: Building2,
    title: "Corporate Teams",
    description: "Executive retreats, team building events, and business conferences worldwide.",
  },
  {
    icon: Trophy,
    title: "Sports Teams",
    description: "Professional and amateur teams with equipment handling and flexible scheduling.",
  },
  {
    icon: GraduationCap,
    title: "Educational Groups",
    description: "School trips, university programs, and educational tours with group supervision.",
  },
  {
    icon: Users,
    title: "Events & Conferences",
    description: "Large-scale events, conventions, and corporate gatherings with bulk pricing.",
  },
]

const enterpriseFeatures = [
  {
    icon: HeadphonesIcon,
    title: "Dedicated Account Manager",
    description: "Your personal travel expert available 24/7 for all your group travel needs.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment Terms",
    description: "Custom payment plans, invoicing options, and corporate credit terms available.",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Skip the queue with priority phone, email, and chat support channels.",
  },
  {
    icon: Clock,
    title: "Faster Quote Turnaround",
    description: "Enterprise clients receive quotes within 2 hours during business hours.",
  },
  {
    icon: BarChart3,
    title: "Volume Discounts",
    description: "Scale pricing based on annual booking volume and long-term partnerships.",
  },
  {
    icon: Plane,
    title: "500+ Airlines Access",
    description: "Exclusive access to group rates across all major and regional carriers.",
  },
]

const comparisonFeatures = [
  { feature: "Access to 500+ Airlines", standard: true, enterprise: true },
  { feature: "Group Booking Support", standard: true, enterprise: true },
  { feature: "Custom Quotes", standard: true, enterprise: true },
  { feature: "Dedicated Account Manager", standard: false, enterprise: true },
  { feature: "Priority Support (24/7)", standard: false, enterprise: true },
  { feature: "Flexible Payment Terms", standard: false, enterprise: true },
  { feature: "Volume-based Discounts", standard: false, enterprise: true },
  { feature: "Custom Reporting", standard: false, enterprise: true },
]

const industryTypes = [
  { value: "corporate", label: "Corporate / Business Travel" },
  { value: "sports", label: "Sports Teams" },
  { value: "education", label: "Educational Institutions" },
  { value: "events", label: "Events & Conferences" },
  { value: "government", label: "Government & NGO" },
  { value: "other", label: "Other" },
]

// Mobile Select Component
interface MobileSelectProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  required?: boolean
}

function MobileSelect({ label, value, onValueChange, placeholder, options, required = false }: MobileSelectProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  if (isMobile) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between text-left font-normal"
          onClick={() => setIsOpen(true)}
        >
          <span className={!value ? "text-muted-foreground" : ""}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    value === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Select required={required} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function B2BPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industryType: '',
    annualTravelBudget: '',
    numberOfEmployees: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/enterprise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          industry_type: formData.industryType,
          annual_travel_budget: formData.annualTravelBudget || null,
          number_of_employees: formData.numberOfEmployees || null,
          message: formData.message,
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

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industryType: '',
      annualTravelBudget: '',
      numberOfEmployees: '',
      message: '',
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg-corporat.jpg"
            alt="Corporate travel background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <Badge variant="secondary" className="mb-4">
            Enterprise Solutions
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Corporate Group Travel
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Access to 500+ airlines, dedicated account management, and flexible payment terms
            for your organization. From corporate teams to educational groups.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#enterprise-form">
              <Button size="lg">
                Request Enterprise Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="tel:+14158542675">
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                +1-415-854-2675
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="mt-2 text-sm text-muted-foreground">Airlines Worldwide</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="mt-2 text-sm text-muted-foreground">Priority Support</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">2hrs</div>
                <p className="mt-2 text-sm text-muted-foreground">Quote Turnaround</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Industries We Serve
            </Badge>
            <h2 className="text-3xl font-bold">Tailored Solutions for Every Sector</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand that different industries have unique travel requirements.
              Our solutions are customized to meet your specific needs.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <Card key={industry.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <industry.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{industry.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {industry.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Enterprise Benefits
            </Badge>
            <h2 className="text-3xl font-bold">Why Choose Enterprise?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock premium features and dedicated support designed for high-volume business travel.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enterpriseFeatures.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Compare Plans
            </Badge>
            <h2 className="text-3xl font-bold">Standard vs. Enterprise</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-4 text-left font-semibold">Feature</th>
                      <th className="py-4 px-4 text-center font-semibold">Standard</th>
                      <th className="py-4 px-4 text-center font-semibold bg-primary/5">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4 px-4 text-sm">{item.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {item.standard ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center bg-primary/5">
                          {item.enterprise ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enterprise Form */}
      <section className="py-16" id="enterprise-form">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Get Started
            </Badge>
            <h2 className="text-3xl font-bold">Request Enterprise Access</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fill out the form below and our enterprise team will contact you within 24 hours.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Corporation"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <PhoneInput
                      id="phone"
                      placeholder="Enter phone number"
                      required
                      value={formData.phone}
                      onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industryType">Industry Type *</Label>
                    <MobileSelect
                      label="Industry Type"
                      required
                      value={formData.industryType}
                      onValueChange={(value) => setFormData({ ...formData, industryType: value })}
                      placeholder="Select your industry"
                      options={industryTypes}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <Input
                      id="numberOfEmployees"
                      type="number"
                      placeholder="e.g., 250"
                      min="1"
                      value={formData.numberOfEmployees}
                      onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualTravelBudget">Estimated Annual Travel Budget (USD)</Label>
                  <Input
                    id="annualTravelBudget"
                    placeholder="e.g., $100,000"
                    value={formData.annualTravelBudget}
                    onChange={(e) => setFormData({ ...formData, annualTravelBudget: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell Us About Your Travel Needs *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your typical group travel requirements, frequency, destinations, etc."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Request Enterprise Access
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What qualifies as an enterprise account?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Enterprise accounts are designed for organizations with regular group travel needs,
                typically booking 10+ passengers multiple times per year. This includes corporations,
                educational institutions, sports teams, and event organizers. We evaluate based on
                annual travel volume and frequency.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What are the payment terms for enterprise clients?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Enterprise clients can choose from flexible payment options including corporate
                invoicing (NET 30 terms), split payments, and custom payment schedules. We also
                offer the option to set up corporate credit terms after an initial partnership period.
                Specific terms are negotiated based on your organization&apos;s needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do volume discounts work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Volume discounts are tiered based on your annual booking volume. The more you travel
                with us, the better rates you receive. Discounts typically range from 5-20% depending
                on total annual spend. Your dedicated account manager will work with you to structure
                the best pricing for your organization.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What kind of reporting do you provide?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Enterprise clients receive comprehensive monthly and annual reports including:
                total travel spend, cost savings vs. standard rates, booking trends, preferred routes
                and destinations, and carbon footprint tracking. Custom reports can be generated based
                on your specific KPIs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a minimum commitment required?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We don&apos;t require long-term contracts or minimum commitments. However, to qualify for
                enterprise pricing and benefits, we typically look for organizations planning at least
                4-6 group bookings per year or a minimum annual travel spend. Contact us to discuss
                your specific situation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                Join hundreds of organizations that trust Priority Flyers for their group travel needs.
                Our enterprise team is standing by to help you get started.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <a href="#enterprise-form">
                  <Button size="lg" variant="secondary">
                    Request Enterprise Quote
                  </Button>
                </a>
                <a href="mailto:info@priorityflyers.com">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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
              <h3 className="font-semibold text-lg">Thank you, {formData.contactName}!</h3>
              <p className="text-muted-foreground">
                Your enterprise inquiry has been received. Our enterprise team will review your
                requirements and contact you within 24 hours.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 w-full text-sm space-y-1">
              <p><span className="text-muted-foreground">Company:</span> {formData.companyName}</p>
              <p><span className="text-muted-foreground">Email:</span> {formData.email}</p>
              <p><span className="text-muted-foreground">Industry:</span> {industryTypes.find(t => t.value === formData.industryType)?.label || formData.industryType}</p>
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
