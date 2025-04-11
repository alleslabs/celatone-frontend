import type { ComponentConfig, ThemeConfig } from "./types";

import { generateTheme } from "./utils";

const DEFAULT_BASE_THEME: ThemeConfig = {
  branding: {
    logo: "/celatone.svg",
    favicon: "https://assets.alleslabs.dev/celatone-brand/favicon.ico",
    seo: {
      appName: "Celatone",
      title: "Celatone Explorer",
      description: "All in one place.",
      image:
        "https://assets.alleslabs.dev/celatone-brand/socials/celatone-ogimg.jpg",
      x: {
        handle: "@celatone_",
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
      lighter: "#F0D5FF",
      light: "#E1ADFE",
      main: "#CE89F4",
      dark: "#A758D3",
      darker: "#9123CE",
      background: "#432E4F",
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
    text: {
      main: "#F5F5F5",
      dark: "#D1D9E0",
      disabled: "#A1A6AA",
    },
    background: {
      main: "#070708",
      overlay: "rgba(7, 7, 8, 0.7)",
    },
    success: {
      main: "#42BEA6",
      light: "#67CBB7",
      dark: "#207966",
      background: "#102E28",
    },
    error: {
      light: "#FF8383",
      main: "#FF5656",
      dark: "#C71919",
      background: "#510B0B",
    },
    warning: {
      light: "#FFD08B",
      main: "#FFBE5D",
      dark: "#D78812",
      background: "#553505",
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
    medium: "https://medium.com/@initialabs",
  },
};

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = {
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
      borderColor: "primary.main",
      color: "primary.main",
      disabledBorderColor: "primary.background",
      disabledColor: "primary.darker",
      hoverBackground: "primary.background",
      activeBackground: "primary.background",
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
      bg: "primary.darker",
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

export const DEFAULT_THEME = generateTheme(
  DEFAULT_BASE_THEME,
  DEFAULT_COMPONENT_CONFIG
);
