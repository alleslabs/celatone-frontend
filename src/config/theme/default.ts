import type { ThemeConfig } from "./types";

export const DEFAULT_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/branding/logo/logo.svg",
    favicon: "https://assets.alleslabs.dev/branding/favicon.ico",
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
  },
  colors: {
    gradient: {
      main: "linear(to-tr, #5942F3, #9793F3)",
    },
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
      main: "#42BEA6",
      light: "#67CBB7",
      dark: "#207966",
      background: "#102E28",
    },
    background: {
      main: "#111117",
      overlay: "rgba(17, 17, 23, 0.7)",
    },
    text: {
      main: "#F7F2FE",
      dark: "#ADADC2",
      disabled: "#8A8AA5",
    },
    primary: {
      main: "#5942F3",
      light: "#9793F3",
      lighter: "#DCDBFB",
      dark: "#3E38B0",
      darker: "#292676",
      background: "#181733",
    },
    secondary: {
      main: "#D8BEFC",
      light: "#E8D8FD",
      dark: "#A28FBD",
      darker: "#6C5F7E",
      background: "#36303F",
    },
    accent: {
      main: "#C6E141",
      light: "#DDED8D",
      lighter: "#E8F3B3",
      dark: "#95A931",
      darker: "#637121",
      background: "#3D470B",
    },
    gray: {
      100: "#F7F2FE",
      400: "#ADADC2",
      500: "#8A8AA5",
      600: "#68688A",
      700: "#343445",
      800: "#272734",
      900: "#1A1A22",
    },
  },
  tag: {
    signer: {
      bg: "accent.darker",
      color: "inherit",
    },
    related: {
      bg: "primary.dark",
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
    error: "https://assets.alleslabs.dev/illustration/404.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/illustration/search-not-found.svg",
    searchEmpty: "https://assets.alleslabs.dev/illustration/search-empty.svg",
    disconnected: "https://assets.alleslabs.dev/illustration/disconnected.svg",
    overview: {
      main: "https://assets.alleslabs.dev/illustration/bg-left.svg",
      secondary: "https://assets.alleslabs.dev/illustration/bg-right.svg",
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
