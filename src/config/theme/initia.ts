/* eslint-disable sonarjs/no-duplicate-string */
import type { ComponentConfig, ThemeConfig } from "./types";
import { generateTheme } from "./utils";

const INITIA_BASE_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg",
    favicon: "https://assets.alleslabs.dev/integrations/initia/favicon.svg",
    seo: {
      appName: "Initia",
      title: "Initia Scan",
      description: "Initia, a network for interwoven rollups",
      image:
        "https://assets.alleslabs.dev/celatone-brand/socials/scan-ogimage.jpg",
      x: {
        handle: "@initia",
        cardType: "summary_large_image",
      },
    },
  },
  colors: {
    primary: {
      lighter: "#9AF3FF",
      light: "#71EEFF",
      main: "#4CE2F7",
      dark: "#00B5CE",
      darker: "#007080",
      background: "#0E3139",
    },
    secondary: {
      lighter: "#EBDDFF",
      light: "#D8BEFC",
      main: "#D2A3F9",
      dark: "#A28FBD",
      darker: "#6C5F7E",
      background: "#36303F",
    },
    gray: {
      100: "#F5F5F5",
      400: "#D1D9E0",
      500: "#A1A6AA",
      600: "#757C82",
      700: "#303437",
      800: "#222426",
      900: "#161717",
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
      overlay: "rgba(7, 7, 8, 0.7)",
    },
    text: {
      main: "#F5F5F5",
      dark: "#B7B7B7",
      disabled: "#A1A6AA",
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
  },
  socialMedia: {
    website: "https://initia.xyz",
    github: "https://github.com/initia-labs",
    x: "https://x.com/initia",
    medium: "https://medium.com/@initiafdn",
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
      bg: "primary.darker",
    },
    votingPeriod: {
      bg: "secondary.darker",
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
      bg: "gray.700",
      color: "text.main",
    },
  },
  voteParticipations: {
    voted: "primary.main",
    votedAbstain: "secondary.dark",
    didNotVote: "gray.700",
  },
  recentBlocks: {
    signed: "primary.dark",
    proposed: "secondary.light",
    missed: "error.dark",
  },
};

export const INITIA_THEME = generateTheme(
  INITIA_BASE_THEME,
  INITIA_COMPONENT_CONFIG
);
