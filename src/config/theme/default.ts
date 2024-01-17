import type { ThemeConfig } from "./types";

export const DEFAULT_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/celatone-brand/logo/full-white.svg",
    favicon: "https://assets.alleslabs.dev/celatone-brand/favicon.ico",
    seo: {
      appName: "Celatone",
      title: "Celatone Explorer for Cosmos chain",
      description: "A smart contract powered explorer for the Cosmos.",
      image: "https://assets.alleslabs.dev/celatone-brand/socials/ogimage.jpg",
      twitter: {
        handle: "@celatone_",
        cardType: "summary_large_image",
      },
    },
  },
  fonts: {
    heading: {
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap",
      name: "Poppins, serif",
    },
    body: {
      url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
      name: "Space Grotesk, sans-serif",
    },
    link: {
      url: "/font/main.css",
      name: "PP Neue Montreal Regular, serif",
    },
  },
  colors: {
    primary: {
      lighter: "#E0F1FB",
      light: "#C2EAFF",
      main: "#89D1F6",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    secondary: {
      light: "#C2EAFF",
      main: "#89D1F6",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    accent: {
      lighter: "#E0F1FB",
      light: "#C2EAFF",
      main: "#89D1F6",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    gray: {
      100: "#F8FAFC",
      400: "#B7C1CD",
      500: "#8A99AE",
      600: "#707E94",
      700: "#334155",
      800: "#1E2535",
      900: "#0A101E",
    },
    text: {
      main: "#F8FAFC",
      dark: "#CBD5E1",
      disabled: "#94A3B8",
    },
    background: {
      main: "#020617",
      overlay: "rgba(2, 6, 23, 0.7)",
    },
    success: {
      light: "#D6FFD4",
      main: "#9FF59A",
      dark: "#497252",
      background: "#213631",
    },
    error: {
      light: "#FF8086",
      main: "#FF666E",
      dark: "#B43E44",
      background: "#4C1A1D",
    },
    warning: {
      light: "#FFCC66",
      main: "#FFBB33",
      dark: "#CC8800",
      background: "#523600",
    },
  },
  button: {
    primary: {
      background: "#89D1F6",
      color: "#272D3C",
      disabledBackground: "#335068",
      disabledColor: "#0A101E",
      hoverBackground: "#5ABAEC",
      activeBackground: "#2B8BBD",
    },
    outlinePrimary: {
      borderColor: "#89D1F6",
      color: "#89D1F6",
      disabledBorderColor: "#335068",
      disabledColor: "#2B8BBD",
      hoverBackground: "#335068",
      activeBackground: "#335068",
    },
  },
  tag: {
    signer: {
      bg: "accent.darker",
      color: "inherit",
    },
    related: {
      bg: "gray.700",
      color: "text.main",
    },
  },
  borderRadius: {
    default: "8px",
    iconButton: "36px",
    viewButton: "0 0 8px 8px",
    uploadButton: "50%",
    tag: "full",
    badge: "16px",
    radio: "12px",
    indicator: "2px",
    stepper: "full",
  },
  jsonTheme: "monokai",
  illustration: {
    "404":
      "https://assets.alleslabs.dev/celatone-brand/illustration/states/404.svg",
    error:
      "https://assets.alleslabs.dev/celatone-brand/illustration/states/error.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/celatone-brand/illustration/states/search-not-found.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/celatone-brand/illustration/states/search-empty.svg",
    disconnected:
      "https://assets.alleslabs.dev/celatone-brand/illustration/states/disconnected.svg",
    overview: {
      main: "https://assets.alleslabs.dev/celatone-brand/illustration/left.svg",
      secondary:
        "https://assets.alleslabs.dev/celatone-brand/illustration/right.svg",
    },
  },
  socialMedia: {
    website: "https://celat.one/",
    github: "https://github.com/alleslabs",
    twitter: "https://twitter.com/celatone_",
    medium: "https://blog.alleslabs.com/",
    telegram: "https://t.me/celatone_announcements",
  },
};
