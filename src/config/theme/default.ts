/* eslint-disable sonarjs/no-duplicate-string */
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
      name: "PP Neue Montreal Mono Regular",
    },
  },
  colors: {
    primary: {
      lighter: "#E0F1FB",
      light: "#C2EAFF",
      main: "#89D1F6",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#244865",
    },
    secondary: {
      light: "#C2EAFF",
      main: "#89D1F6",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#244865",
    },
    accent: {
      lighter: "#FDFAEC",
      light: "#F9F0C8",
      main: "#F5E6A3",
      dark: "#EDD25A",
      darker: "#7B703A",
      background: "#3B3928",
    },
    gray: {
      100: "#F8FAFC",
      400: "#B7C1CD",
      500: "#8A99AE",
      600: "#707E94",
      700: "#334155",
      800: "#1E2535",
      900: "#151B27",
    },
    text: {
      main: "#F8FAFC",
      dark: "#CBD5E1",
      disabled: "#94A3B8",
    },
    background: {
      main: "#0E131C",
      overlay: "rgba(2, 6, 23, 0.7)",
    },
    success: {
      main: "#42BEA6",
      light: "#67CBB7",
      dark: "#207966",
      background: "#102E28",
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
  proposalChip: {
    depositPeriod: {
      bg: "primary.background",
      color: "inherit",
    },
    votingPeriod: {
      bg: "primary.darker",
      color: "inherit",
    },
    failed: {
      bg: "error.dark",
      color: "inherit",
    },
    rejected: {
      bg: "error.dark",
      color: "inherit",
    },
    passed: {
      bg: "success.dark",
      color: "inherit",
    },
    cancelled: {
      bg: "error.background",
      color: "inherit",
    },
    depositFailed: {
      bg: "gray.700",
      color: "inherit",
    },
  },
  voteParticipations: {
    voted: "primary.main",
    votedAbstain: "primary.darker",
    didNotVote: "gray.700",
  },
  button: {
    primary: {
      background: "primary.main",
      color: "gray.800",
      disabledBackground: "primary.background",
      disabledColor: "gray.800",
      hoverBackground: "primary.dark",
      activeBackground: "primary.darker",
    },
    outlinePrimary: {
      borderColor: "primary.main",
      color: "primary.main",
      disabledBorderColor: "primary.background",
      disabledColor: "primary.darker",
      hoverBackground: "primary.background",
      activeBackground: "primary.background",
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
  stepper: {
    active: {
      bg: "primary.darker",
      color: "text.main",
    },
    disabled: {
      bg: "gray.500",
      color: "background.main",
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
  jsonTheme: "pastel_on_dark",
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
