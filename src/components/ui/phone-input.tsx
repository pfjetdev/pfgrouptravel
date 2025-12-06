"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const countries = [
  { code: "AF", name: "Afghanistan", dial: "+93", flag: "🇦🇫", popular: false },
  { code: "AL", name: "Albania", dial: "+355", flag: "🇦🇱", popular: false },
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿", popular: false },
  { code: "AD", name: "Andorra", dial: "+376", flag: "🇦🇩", popular: false },
  { code: "AO", name: "Angola", dial: "+244", flag: "🇦🇴", popular: false },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷", popular: false },
  { code: "AM", name: "Armenia", dial: "+374", flag: "🇦🇲", popular: false },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", popular: true },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹", popular: false },
  { code: "AZ", name: "Azerbaijan", dial: "+994", flag: "🇦🇿", popular: false },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭", popular: false },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩", popular: false },
  { code: "BY", name: "Belarus", dial: "+375", flag: "🇧🇾", popular: false },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪", popular: false },
  { code: "BZ", name: "Belize", dial: "+501", flag: "🇧🇿", popular: false },
  { code: "BO", name: "Bolivia", dial: "+591", flag: "🇧🇴", popular: false },
  { code: "BA", name: "Bosnia", dial: "+387", flag: "🇧🇦", popular: false },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", popular: false },
  { code: "BN", name: "Brunei", dial: "+673", flag: "🇧🇳", popular: false },
  { code: "BG", name: "Bulgaria", dial: "+359", flag: "🇧🇬", popular: false },
  { code: "KH", name: "Cambodia", dial: "+855", flag: "🇰🇭", popular: false },
  { code: "CM", name: "Cameroon", dial: "+237", flag: "🇨🇲", popular: false },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", popular: true },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱", popular: false },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳", popular: false },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴", popular: false },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷", popular: false },
  { code: "HR", name: "Croatia", dial: "+385", flag: "🇭🇷", popular: false },
  { code: "CU", name: "Cuba", dial: "+53", flag: "🇨🇺", popular: false },
  { code: "CY", name: "Cyprus", dial: "+357", flag: "🇨🇾", popular: false },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿", popular: false },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰", popular: false },
  { code: "DO", name: "Dominican Republic", dial: "+1", flag: "🇩🇴", popular: false },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨", popular: false },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬", popular: false },
  { code: "SV", name: "El Salvador", dial: "+503", flag: "🇸🇻", popular: false },
  { code: "EE", name: "Estonia", dial: "+372", flag: "🇪🇪", popular: false },
  { code: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹", popular: false },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮", popular: false },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", popular: true },
  { code: "GE", name: "Georgia", dial: "+995", flag: "🇬🇪", popular: false },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", popular: true },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭", popular: false },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷", popular: false },
  { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹", popular: false },
  { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳", popular: false },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰", popular: false },
  { code: "HU", name: "Hungary", dial: "+36", flag: "🇭🇺", popular: false },
  { code: "IS", name: "Iceland", dial: "+354", flag: "🇮🇸", popular: false },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳", popular: false },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩", popular: false },
  { code: "IR", name: "Iran", dial: "+98", flag: "🇮🇷", popular: false },
  { code: "IQ", name: "Iraq", dial: "+964", flag: "🇮🇶", popular: false },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪", popular: false },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱", popular: false },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", popular: true },
  { code: "JM", name: "Jamaica", dial: "+1", flag: "🇯🇲", popular: false },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", popular: false },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴", popular: false },
  { code: "KZ", name: "Kazakhstan", dial: "+7", flag: "🇰🇿", popular: false },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪", popular: false },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼", popular: false },
  { code: "KG", name: "Kyrgyzstan", dial: "+996", flag: "🇰🇬", popular: false },
  { code: "LA", name: "Laos", dial: "+856", flag: "🇱🇦", popular: false },
  { code: "LV", name: "Latvia", dial: "+371", flag: "🇱🇻", popular: false },
  { code: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧", popular: false },
  { code: "LY", name: "Libya", dial: "+218", flag: "🇱🇾", popular: false },
  { code: "LT", name: "Lithuania", dial: "+370", flag: "🇱🇹", popular: false },
  { code: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺", popular: false },
  { code: "MO", name: "Macau", dial: "+853", flag: "🇲🇴", popular: false },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾", popular: false },
  { code: "MV", name: "Maldives", dial: "+960", flag: "🇲🇻", popular: false },
  { code: "MT", name: "Malta", dial: "+356", flag: "🇲🇹", popular: false },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", popular: false },
  { code: "MD", name: "Moldova", dial: "+373", flag: "🇲🇩", popular: false },
  { code: "MC", name: "Monaco", dial: "+377", flag: "🇲🇨", popular: false },
  { code: "MN", name: "Mongolia", dial: "+976", flag: "🇲🇳", popular: false },
  { code: "ME", name: "Montenegro", dial: "+382", flag: "🇲🇪", popular: false },
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦", popular: false },
  { code: "MM", name: "Myanmar", dial: "+95", flag: "🇲🇲", popular: false },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵", popular: false },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", popular: false },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿", popular: false },
  { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮", popular: false },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", popular: false },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴", popular: false },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲", popular: false },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰", popular: false },
  { code: "PA", name: "Panama", dial: "+507", flag: "🇵🇦", popular: false },
  { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾", popular: false },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪", popular: false },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭", popular: false },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱", popular: false },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", popular: false },
  { code: "PR", name: "Puerto Rico", dial: "+1", flag: "🇵🇷", popular: false },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦", popular: false },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴", popular: false },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺", popular: false },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", popular: false },
  { code: "RS", name: "Serbia", dial: "+381", flag: "🇷🇸", popular: false },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", popular: false },
  { code: "SK", name: "Slovakia", dial: "+421", flag: "🇸🇰", popular: false },
  { code: "SI", name: "Slovenia", dial: "+386", flag: "🇸🇮", popular: false },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", popular: false },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷", popular: false },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", popular: true },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰", popular: false },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪", popular: false },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭", popular: false },
  { code: "TW", name: "Taiwan", dial: "+886", flag: "🇹🇼", popular: false },
  { code: "TJ", name: "Tajikistan", dial: "+992", flag: "🇹🇯", popular: false },
  { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿", popular: false },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭", popular: false },
  { code: "TN", name: "Tunisia", dial: "+216", flag: "🇹🇳", popular: false },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷", popular: false },
  { code: "TM", name: "Turkmenistan", dial: "+993", flag: "🇹🇲", popular: false },
  { code: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬", popular: false },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦", popular: false },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", popular: true },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", popular: true },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", popular: true },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾", popular: false },
  { code: "UZ", name: "Uzbekistan", dial: "+998", flag: "🇺🇿", popular: false },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪", popular: false },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳", popular: false },
  { code: "YE", name: "Yemen", dial: "+967", flag: "🇾🇪", popular: false },
  { code: "ZM", name: "Zambia", dial: "+260", flag: "🇿🇲", popular: false },
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼", popular: false },
]

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Country list component used in both dropdown and drawer
interface CountryListProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCountry: typeof countries[0]
  onCountrySelect: (country: typeof countries[0]) => void
  filteredCountries: typeof countries
  popularCountries: typeof countries
  otherCountries: typeof countries
  variant?: "dropdown" | "drawer"
}

function CountryList({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountrySelect,
  filteredCountries,
  popularCountries,
  otherCountries,
  variant = "dropdown",
}: CountryListProps) {
  const ItemComponent = variant === "dropdown" ? DropdownMenuItem : "div"

  return (
    <>
      <div className={cn(
        "sticky top-0 bg-background border-b",
        variant === "dropdown" ? "p-2" : "p-4"
      )}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
            autoFocus={variant === "dropdown"}
          />
        </div>
      </div>
      <div className={cn(
        "overflow-y-auto",
        variant === "dropdown" ? "max-h-[300px] p-1" : "flex-1 p-2"
      )}>
        {popularCountries.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Popular
            </div>
            {popularCountries.map((country) => (
              <ItemComponent
                key={country.code}
                onClick={() => onCountrySelect(country)}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2.5 rounded-md px-2",
                  selectedCountry.code === country.code && "bg-accent",
                  variant === "drawer" && "hover:bg-accent transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {country.dial}
                </span>
              </ItemComponent>
            ))}
            {otherCountries.length > 0 && variant === "dropdown" && <DropdownMenuSeparator />}
            {otherCountries.length > 0 && variant === "drawer" && <div className="my-2 border-t" />}
          </>
        )}
        {otherCountries.length > 0 && (
          <>
            {!searchQuery && (
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                All Countries
              </div>
            )}
            {otherCountries.map((country) => (
              <ItemComponent
                key={country.code}
                onClick={() => onCountrySelect(country)}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2.5 rounded-md px-2",
                  selectedCountry.code === country.code && "bg-accent",
                  variant === "drawer" && "hover:bg-accent transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {country.dial}
                </span>
              </ItemComponent>
            ))}
          </>
        )}
        {filteredCountries.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No countries found
          </div>
        )}
      </div>
    </>
  )
}

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: string
  onChange?: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value = "", ...props }, ref) => {
    const isMobile = useIsMobile()
    const [selectedCountry, setSelectedCountry] = React.useState(
      countries.find((c) => c.code === "US") || countries[0]
    )
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)

    // Parse initial value
    React.useEffect(() => {
      if (value && value.startsWith("+")) {
        // Find matching country by dial code
        const country = countries.find((c) => value.startsWith(c.dial))
        if (country) {
          setSelectedCountry(country)
          setPhoneNumber(value.slice(country.dial.length).trim())
        } else {
          setPhoneNumber(value)
        }
      } else {
        setPhoneNumber(value)
      }
    }, [])

    const handleCountryChange = (country: typeof countries[0]) => {
      setSelectedCountry(country)
      const fullNumber = phoneNumber
        ? `${country.dial} ${phoneNumber}`.trim()
        : `${country.dial} `
      onChange?.(fullNumber)
      setIsOpen(false)
      setSearchQuery("")
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value
      const prefix = `${selectedCountry.dial} `

      // Ensure the prefix is always present
      if (!newValue.startsWith(prefix)) {
        // If user tries to delete the prefix, restore it
        newValue = prefix + newValue.replace(prefix, "")
      }

      // Extract just the phone number part (after the prefix)
      const newPhone = newValue.slice(prefix.length)
      setPhoneNumber(newPhone)
      onChange?.(newValue.trim())
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget
      const prefix = `${selectedCountry.dial} `
      const cursorPosition = input.selectionStart || 0

      // Prevent deletion of the prefix
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        cursorPosition <= prefix.length
      ) {
        e.preventDefault()
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const input = e.currentTarget
      const prefix = `${selectedCountry.dial} `
      const cursorPosition = input.selectionStart || 0

      // Prevent cursor from being placed before the prefix
      if (cursorPosition < prefix.length) {
        setTimeout(() => {
          input.setSelectionRange(prefix.length, prefix.length)
        }, 0)
      }
    }

    const filteredCountries = React.useMemo(() => {
      const query = searchQuery.toLowerCase()
      return countries.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dial.includes(query) ||
          country.code.toLowerCase().includes(query)
      )
    }, [searchQuery])

    const popularCountries = filteredCountries.filter((c) => c.popular)
    const otherCountries = filteredCountries.filter((c) => !c.popular)

    const triggerButton = (
      <InputGroupButton variant="ghost" size="sm" className="gap-1.5 px-3">
        <span className="text-xl leading-none">
          {selectedCountry.flag}
        </span>
        <span className="text-sm font-medium text-foreground">
          {selectedCountry.dial}
        </span>
        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
      </InputGroupButton>
    )

    return (
      <InputGroup className={className}>
        <InputGroupAddon>
          {isMobile ? (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                {triggerButton}
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader>
                  <DrawerTitle>Select Country</DrawerTitle>
                </DrawerHeader>
                <CountryList
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCountry={selectedCountry}
                  onCountrySelect={handleCountryChange}
                  filteredCountries={filteredCountries}
                  popularCountries={popularCountries}
                  otherCountries={otherCountries}
                  variant="drawer"
                />
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                {triggerButton}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[320px] p-0">
                <CountryList
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCountry={selectedCountry}
                  onCountrySelect={handleCountryChange}
                  filteredCountries={filteredCountries}
                  popularCountries={popularCountries}
                  otherCountries={otherCountries}
                  variant="dropdown"
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </InputGroupAddon>
        <InputGroupInput
          ref={ref}
          type="tel"
          placeholder="Phone number"
          value={`${selectedCountry.dial} ${phoneNumber}`}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          {...props}
        />
      </InputGroup>
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
