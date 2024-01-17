import type { ThemeConfig } from "./types";

export const TEST_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/celatone-brand/logo/full-white.svg",
    favicon: "https://assets.alleslabs.dev/celatone-brand/favicon.ico",
    seo: {
      appName: "Celatone",
      title: "Celatone Explorer for Cosmos chain",
      description: "A smart contract powered explorer for the Cosmos.",
      image: "https://assets.alleslabs.dev/branding/celatone-cover.jpg",
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
    error: {
      main: "#FF666E",
      light: "#FF8086",
      dark: "#B43E44",
      background: "#4C1A1D",
    },
    warning: {
      main: "#FFBB33",
      light: "#FFCC66",
      dark: "#CC8800",
      background: "#523600",
    },
    success: {
      main: "#9FF59A",
      light: "#D6FFD4",
      dark: "#477145",
      background: "#1A3919",
      //   main: "#9FF59A",
      //   light: "#D6FFD4",
      //   lighter: "#E7FFE6",
      //   dark: "#8DEF88",
      //   darker: "#69CC64",
      //   background: "#1C491A",
    },
    background: {
      main: "#020617",
      overlay: "rgba(17, 17, 23, 0.7)",
    },
    text: {
      main: "#F8FAFC",
      dark: "#CBD5E1",
      disabled: "#94A3B8",
    },
    primary: {
      main: "#89D1F6",
      light: "#C2EAFF",
      lighter: "#E0F1FB",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    secondary: {
      main: "#89D1F6",
      light: "#C2EAFF",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    accent: {
      main: "#89D1F6",
      light: "#C2EAFF",
      lighter: "#E0F1FB",
      dark: "#5ABAEC",
      darker: "#2B8BBD",
      background: "#335068",
    },
    gray: {
      100: "#F8FAFC",
      400: "#CBD5E1",
      500: "#94A3B8",
      600: "#798495",
      700: "#334155",
      800: "#1E2432",
      900: "#0A101E",
    },
  },
  button: {
    primary: {
      background: "#89D1F6",
      color: "#272D3C",
      disabledBackground: "#2F3544",
      disabledColor: "#0F172A",
      hoverBackground: "#5ABAEC",
      activeBackground: "#2B8BBD",
    },
    outlinePrimary: {
      borderColor: "#89D1F6",
      color: "#89D1F6",
      disabledBorderColor: "#2F3544",
      disabledColor: "#0F172A",
      hoverBackground: "#335068",
      activeBackground: "#2B8BBD",
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
    "404": "https://assets.alleslabs.dev/illustration/404.svg",
    error: "https://assets.alleslabs.dev/illustration/error.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/illustration/search-not-found.svg",
    searchEmpty: "https://assets.alleslabs.dev/illustration/search-empty.svg",
    disconnected: "https://assets.alleslabs.dev/illustration/disconnected.svg",
    overview: {
      main: "https://assets.alleslabs.dev/illustration/left.svg",
      secondary: "https://assets.alleslabs.dev/illustration/right.svg",
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
