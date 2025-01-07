/* eslint-disable sonarjs/no-duplicate-string */
import type { ComponentConfig, ThemeConfig } from "config/theme/types";

import { generateTheme } from "./utils";

const SEI_BASE_THEME: ThemeConfig = {
  branding: {
    favicon: "https://assets.alleslabs.dev/integrations/sei/favicon.ico",
    logo: "https://assets.alleslabs.dev/integrations/sei/logo.svg",
    seo: {
      appName: "SeiScan",
      description:
        "Explore, deploy, execute, and query smart contracts on Sei from a user-friendly web UI",
      image: "https://assets.alleslabs.dev/integrations/sei/cover.jpg",
      title: "SeiScan",
      twitter: {
        cardType: "summary_large_image",
        handle: "@SeiNetwork",
      },
    },
  },
  colors: {
    background: {
      main: "#000E13",
      overlay: "rgba(6, 21, 27, 0.7)",
    },
    error: {
      background: "#4C1A1D",
      dark: "#B43E44",
      light: "#FF8086",
      main: "#FF666E",
    },
    gray: {
      100: "#FCFCFD",
      400: "#92A4B5",
      500: "#586D81",
      600: "#40566A",
      700: "#1D343F",
      800: "#132730",
      900: "#0C1C23",
    },
    primary: {
      background: "#303939",
      dark: "#C0B8A9",
      darker: "#787971",
      light: "#FAF6EF",
      lighter: "#FAF6EF",
      main: "#F0E3CF",
    },
    secondary: {
      background: "#203043",
      dark: "#516799",
      darker: "#3F4F78",
      light: "#8797C0",
      lighter: "#8797C0",
      main: "#6C80B2",
    },
    success: {
      background: "#102E28",
      dark: "#207966",
      light: "#67CBB7",
      main: "#42BEA6",
    },
    text: {
      dark: "#92A4B5",
      disabled: "#586D81",
      main: "#FCFCFD",
    },
    warning: {
      background: "#523600",
      dark: "#CC8800",
      light: "#FFCC66",
      main: "#FFBB33",
    },
  },
  footer: {
    description:
      "A Smart Contract Explorer for Sei | Explore, deploy, execute, and query smart contracts on Sei from a user-friendly web UI",
    iconStyle: "rounded",
    logo: "https://assets.alleslabs.dev/integrations/sei/logo-sei.png",
  },
  illustration: {
    "404": "https://assets.alleslabs.dev/integrations/sei/illustration/404.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/sei/illustration/disconnected.svg",
    error:
      "https://assets.alleslabs.dev/integrations/sei/illustration/error.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/sei/illustration/search-empty.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/sei/illustration/search-not-found.svg",
  },
  jsonTheme: "one_dark",
  socialMedia: {
    discord: "https://discord.com/invite/sei",
    github: "https://github.com/sei-protocol/sei-chain",
    telegram: "https://t.me/seinetwork",
    twitter: "https://twitter.com/SeiNetwork",
    website: "https://www.sei.io/",
  },
};

const SEI_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    outlinePrimary: {
      activeBackground: "primary.light",
      borderColor: "primary.darker",
      color: "primary.main",
      disabledBorderColor: "gray.700",
      disabledColor: "gray.600",
      hoverBackground: "primary.darker",
    },
    primary: {
      activeBackground: "primary.light",
      background: "primary.main",
      color: "gray.900",
      disabledBackground: "primary.darker",
      disabledColor: "gray.900",
      hoverBackground: "primary.dark",
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
      bg: "secondary.dark",
    },
  },
  recentBlocks: {
    missed: "error.dark",
    proposed: "primary.main",
    signed: "secondary.main",
  },
  stepper: {
    active: {
      bg: "secondary.main",
      color: "gray.100",
    },
    disabled: {
      bg: "gray.500",
      color: "background.main",
    },
  },
  tag: {
    related: {
      bg: "primary.dark",
      color: "gray.900",
    },
    signer: {
      bg: "secondary.darker",
      color: "text.main",
    },
  },
  voteParticipations: {
    didNotVote: "gray.700",
    voted: "secondary.main",
    votedAbstain: "secondary.darker",
  },
};

export const SEI_THEME = generateTheme(SEI_BASE_THEME, SEI_COMPONENT_CONFIG);
