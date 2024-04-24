import type { ThemeConfig } from "./types";

export const INITIA_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/initia/logo.png",
    favicon: "https://assets.alleslabs.dev/integrations/initia/favicon.svg",
    seo: {
      appName: "Initia",
      title: "Initia Explorer | Powered by Celatone",
      description:
        "Explore Initia's layered ecosystem effortlessly, bridging Web2 to Web3, while delving into sovereign applications.",
      image: "https://assets.alleslabs.dev/integrations/initia/cover.jpg",
      twitter: {
        handle: "@initiafnd",
        cardType: "summary_large_image",
      },
    },
  },
  fonts: {
    heading: {
      url: "/font/pilatwide.css",
      name: "Pilat Wide, serif",
    },
    body: {
      url: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap",
      name: "Manrope, sans-serif",
    },
  },
  colors: {
    gradient: {
      main: "linear(to-tr, #15AFF8, #5FC1EE)",
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
      main: "#070708",
      overlay: "rgba(17, 17, 23, 0.7)",
    },
    text: {
      main: "#F5F5F5",
      dark: "#B7B7B7",
      disabled: "#A1A6AA",
    },
    primary: {
      main: "#2AB9FC",
      light: "#5FC1EE",
      lighter: "#79D5FF",
      dark: "#15AFF8",
      darker: "#008FD7",
      background: "#005881",
    },
    secondary: {
      main: "#2AB9FC",
      light: "#5FC1EE",
      dark: "#15AFF8",
      darker: "#008FD7",
      background: "#005881",
    },
    accent: {
      main: "#D8BEFC",
      light: "#D2A3F9",
      lighter: "#79D5FF",
      dark: "#A28FBD",
      darker: "#6C5F7E",
      background: "#36303F",
    },
    gray: {
      100: "#F5F5F5",
      400: "#B7B7B7",
      500: "#A1A6AA",
      600: "#7C7F83",
      700: "#3B3E41",
      800: "#26282B",
      900: "#151617",
    },
    overlay: {
      transaction: "rgba(217, 217, 217, 0.1)",
      block: "rgba(32, 135, 255, 0.1)",
      validator: "rgba(255, 157, 189, 0.1)",
      proposal: "rgba(74, 194, 255, 0.1)",
      code: "rgba(161, 255, 88, 0.1)",
      account: "rgba(105, 255, 255, 0.1)",
      contract: "rgba(124, 118, 255, 0.1)",
      module: "rgba(124, 118, 255, 0.1)",
      collection: "rgba(255, 233, 119, 0.1)",
      nft: "rgba(255, 159, 129, 0.1)",
    },
  },
  tag: {
    signer: {
      bg: "primary.darker",
      color: "text.main",
    },
    related: {
      bg: "accent.darker",
      color: "inherit",
    },
  },
  button: {
    primary: {
      background: "#F5F5F5",
      color: "#151617",
      disabledBackground: "#A1A6AA",
      disabledColor: "#151617",
      hoverBackground: "#B7B7B7",
      activeBackground: "#B7B7B7",
    },
  },
  borderRadius: {
    default: "4px",
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
      "https://assets.alleslabs.dev/integrations/initia/illustration/404.svg",
    error:
      "https://assets.alleslabs.dev/integrations/initia/illustration/error.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/initia/illustration/search-not-found.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/initia/illustration/search-empty.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/initia/illustration/disconnected.svg",
    overview: {
      // Fill image url
      main: "",
    },
  },
  socialMedia: {
    website: "https://initia.tech/",
    github: "https://github.com/initia-labs",
    twitter: "https://twitter.com/initiaFND",
  },
};
