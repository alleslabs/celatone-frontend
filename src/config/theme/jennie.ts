import type { ComponentConfig, ThemeConfig } from "./types";

import { generateTheme } from "./utils";

const JENNIE_BASE_THEME: ThemeConfig = {
  branding: {
    favicon: "https://assets.alleslabs.dev/integrations/initia/favicon.svg",
    logo: "https://assets.alleslabs.dev/integrations/initia/jennie/logo.svg",
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
      main: "#050301",
      overlay: "rgba(17, 17, 23, 0.7)",
    },
    error: {
      background: "#4C1A1D",
      dark: "#B43E44",
      light: "#FF8086",
      main: "#FF666E",
    },
    gray: {
      100: "#F5F5F5",
      400: "#B7B7B7",
      500: "#A1A6AA",
      600: "#7C7F83",
      700: "#292727",
      800: "#1F1D1D",
      900: "#151414",
    },
    primary: {
      background: "#651546",
      dark: "#E06FB5",
      darker: "#CA2B8D",
      light: "#FFB1E7",
      lighter: "#FFD6F3",
      main: "#FFB1E7",
    },
    secondary: {
      background: "#004666",
      dark: "#15AFF8",
      darker: "#008FD7",
      light: "#5FC1EE",
      lighter: "#A3DBF5",
      main: "#2AB9FC",
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
      "https://assets.alleslabs.dev/integrations/initia/jennie/illustration/404.png",
    disconnected:
      "https://assets.alleslabs.dev/integrations/initia/jennie/illustration/disconnected.png",
    error:
      "https://assets.alleslabs.dev/integrations/initia/jennie/illustration/error.png",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/initia/jennie/illustration/search-empty.png",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/initia/jennie/illustration/search-not-found.png",
  },
  jsonTheme: "monokai",
  socialMedia: {
    github: "https://github.com/initia-labs",
    medium: "https://medium.com/@initialabs",
    website: "https://initia.xyz",
    x: "https://x.com/initia",
  },
};

const JENNIE_COMPONENT_CONFIG: ComponentConfig = {
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
      bg: "primary.darker",
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
      bg: "secondary.dark",
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
      bg: "secondary.darker",
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
    votedAbstain: "secondary.darker",
  },
};

export const JENNIE_THEME = generateTheme(
  JENNIE_BASE_THEME,
  JENNIE_COMPONENT_CONFIG
);
