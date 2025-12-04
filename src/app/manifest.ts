import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Priority Flyers - Group Flight Booking",
    short_name: "Priority Flyers",
    description:
      "Book group flight tickets with Priority Flyers. Specialized in group travel for 10+ passengers.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Book Group Flight",
        short_name: "Book",
        description: "Start a new group booking request",
        url: "/#booking-form",
        icons: [{ src: "/icons/shortcut-book.png", sizes: "96x96" }],
      },
      {
        name: "Multi-City Booking",
        short_name: "Multi-City",
        description: "Book multi-city group flights",
        url: "/multi-city",
        icons: [{ src: "/icons/shortcut-fleet.png", sizes: "96x96" }],
      },
      {
        name: "Contact Us",
        short_name: "Contact",
        description: "Get in touch with our team",
        url: "/contact",
        icons: [{ src: "/icons/shortcut-emptylegs.png", sizes: "96x96" }],
      },
    ],
    categories: ["travel", "business", "lifestyle"],
  }
}
