import type { ComponentConfig, ThemeConfig } from "./types";

import { generateTheme } from "./utils";

const INITIA_BASE_THEME: ThemeConfig = {
  branding: {
    favicon: "https://assets.alleslabs.dev/integrations/initia/favicon.svg",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg",
    seo: {
      appName: "Initia",
      description: "Initia, a network for interwoven rollups",
      image:
        "https://assets.alleslabs.dev/celatone-brand/socials/scan-ogimage.jpg",
      title: "Initia Scan",
      x: {
        cardType: "summary_large_image",
        handle: "@initia",
      },
    },
  },
  colors: {
    background: {
      main: "#070708",
      overlay: "rgba(7, 7, 8, 0.7)",
    },
    error: {
      background: "#4C1A1D",
      dark: "#B43E44",
      light: "#FF8086",
      main: "#FF666E",
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
    primary: {
      background: "#0E3139",
      dark: "#00B5CE",
      darker: "#007080",
      light: "#71EEFF",
      lighter: "#9AF3FF",
      main: "#4CE2F7",
    },
    secondary: {
      background: "#36303F",
      dark: "#A28FBD",
      darker: "#6C5F7E",
      light: "#D8BEFC",
      lighter: "#EBDDFF",
      main: "#D2A3F9",
    },
    success: {
      background: "#102E28",
      dark: "#207966",
      light: "#67CBB7",
      main: "#42BEA6",
    },
    text: {
      dark: "#B7B7B7",
      disabled: "#A1A6AA",
      main: "#F5F5F5",
    },
    warning: {
      background: "#523600",
      dark: "#CC8800",
      light: "#FFCC66",
      main: "#FFBB33",
    },
  },
  illustration: {
    "404":
      "https://assets.alleslabs.dev/integrations/initia/illustration/404.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/initia/illustration/disconnected.svg",
    error:
      "https://assets.alleslabs.dev/integrations/initia/illustration/error.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/initia/illustration/search-empty.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/initia/illustration/search-not-found.svg",
  },
  jsonTheme: "monokai",
  socialMedia: {
    github: "https://github.com/initia-labs",
    medium: "https://medium.com/@initialabs",
    website: "https://initia.xyz",
    x: "https://x.com/initia",
  },
};

const INITIA_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    outlinePrimary: {
      activeBackground: "transparent",
      borderColor: "primary.light",
      color: "primary.light",
      disabledBorderColor: "gray.700",
      disabledColor: "gray.600",
      hoverBackground: "primary.background",
    },
    primary: {
      activeBackground: "gray.400",
      background: "gray.100",
      color: "gray.900",
      disabledBackground: "gray.500",
      disabledColor: "gray.900",
      hoverBackground: "gray.400",
    },
  },
  proposalChip: {
    cancelled: {
      bg: "error.background",
    },
    depositFailed: {
      bg: "gray.700",
    },
    depositPeriod: {
      bg: "secondary.darker",
    },
    failed: {
      bg: "error.dark",
    },
    passed: {
      bg: "success.dark",
    },
    rejected: {
      bg: "error.dark",
    },
    votingPeriod: {
      bg: "primary.darker",
    },
  },
  recentBlocks: {
    missed: "error.dark",
    proposed: "secondary.light",
    signed: "primary.dark",
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
    related: {
      bg: "gray.700",
      color: "text.main",
    },
    signer: {
      bg: "primary.darker",
      color: "text.main",
    },
  },
  voteParticipations: {
    didNotVote: "gray.700",
    voted: "primary.main",
    votedAbstain: "secondary.dark",
  },
};

export const INITIA_THEME = generateTheme(
  INITIA_BASE_THEME,
  INITIA_COMPONENT_CONFIG
);
