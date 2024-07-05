/* eslint-disable sonarjs/no-duplicate-string */
import type { ComponentConfig, ThemeConfig } from "./types";
import { generateTheme } from "./utils";

const INITIA_BASE_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg",
    favicon: "https://assets.alleslabs.dev/integrations/initia/favicon.svg",
    seo: {
      appName: "Initia",
      title: "Initia Scan powered by Celatone",
      description:
        "Explore Initia's layered ecosystem effortlessly, bridging Web2 to Web3, while delving into sovereign applications.",
      image: "https://assets.alleslabs.dev/integrations/initia/cover.jpg",
      twitter: {
        handle: "@initiafnd",
        cardType: "summary_large_image",
      },
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

const INITIA_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    primary: {
      background: "gray.100",
      color: "gray.900",
      disabledBackground: "gray.500",
      disabledColor: "gray.900",
      hoverBackground: "gray.400",
      activeBackground: "gray.400",
    },
    outlinePrimary: {
      borderColor: "primary.light",
      color: "primary.light",
      disabledBorderColor: "gray.700",
      disabledColor: "gray.600",
      hoverBackground: "primary.background",
      activeBackground: "transparent",
    },
  },
  proposalChip: {
    depositPeriod: {
      bg: "secondary.darker",
    },
    votingPeriod: {
      bg: "primary.dark",
    },
    failed: {
      bg: "error.dark",
    },
    rejected: {
      bg: "error.dark",
    },
    passed: {
      bg: "success.dark",
    },
    cancelled: {
      bg: "error.background",
    },
    depositFailed: {
      bg: "gray.700",
    },
  },
  stepper: {
    active: {
      bg: "primary.dark",
      color: "text.main",
    },
    disabled: {
      bg: "gray.500",
      color: "background.main",
    },
  },
  tag: {
    signer: {
      bg: "primary.darker",
      color: "text.main",
    },
    related: {
      bg: "accent.darker",
      color: "text.main",
    },
  },
  voteParticipations: {
    voted: "primary.main",
    votedAbstain: "primary.darker",
    didNotVote: "gray.700",
  },
  recentBlocks: {
    signed: "primary.darker",
    proposed: "primary.lighter",
    missed: "error.dark",
  },
};

export const INITIA_THEME = generateTheme(
  INITIA_BASE_THEME,
  INITIA_COMPONENT_CONFIG
);
