/* eslint-disable sonarjs/no-duplicate-string */
import type { ComponentConfig, ThemeConfig } from "config/theme/types";

import { generateTheme } from "./utils";

const SEI_BASE_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/sei/logo.svg",
    favicon: "https://assets.alleslabs.dev/integrations/sei/favicon.ico",
    seo: {
      appName: "SeiScan",
      title: "SeiScan",
      description:
        "Explore, deploy, execute, and query smart contracts on Sei from a user-friendly web UI",
      image: "https://assets.alleslabs.dev/integrations/sei/cover.jpg",
      twitter: {
        handle: "@SeiNetwork",
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
      main: "#000E13",
      overlay: "rgba(6, 21, 27, 0.7)",
    },
    text: {
      main: "#FCFCFD",
      dark: "#92A4B5",
      disabled: "#586D81",
    },
    primary: {
      main: "#F0E3CF",
      light: "#FAF6EF",
      lighter: "#FAF6EF",
      dark: "#C0B8A9",
      darker: "#787971",
      background: "#303939",
    },
    secondary: {
      main: "#6C80B2",
      light: "#8797C0",
      dark: "#184354",
      darker: "#3F4F78",
      background: "#203043",
    },
    accent: {
      main: "#6C80B2",
      light: "#8797C0",
      lighter: "#8797C0",
      dark: "#516799",
      darker: "#3F4F78",
      background: "#203043",
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
  },
  jsonTheme: "one_dark",
  illustration: {
    "404": "https://assets.alleslabs.dev/integrations/sei/illustration/404.svg",
    error:
      "https://assets.alleslabs.dev/integrations/sei/illustration/error.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/sei/illustration/search-not-found.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/sei/illustration/search-empty.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/sei/illustration/disconnected.svg",
  },
  footer: {
    logo: "https://assets.alleslabs.dev/integrations/sei/logo-sei.png",
    description:
      "A Smart Contract Explorer for Sei | Explore, deploy, execute, and query smart contracts on Sei from a user-friendly web UI",
    iconStyle: "rounded",
  },
  socialMedia: {
    website: "https://www.sei.io/",
    github: "https://github.com/sei-protocol/sei-chain",
    discord: "https://discord.com/invite/sei",
    twitter: "https://twitter.com/SeiNetwork",
    telegram: "https://t.me/seinetwork",
  },
};

const SEI_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    primary: {
      background: "primary.main",
      color: "gray.900",
      disabledBackground: "primary.darker",
      disabledColor: "gray.900",
      hoverBackground: "primary.dark",
      activeBackground: "primary.light",
    },
    outlinePrimary: {
      borderColor: "primary.darker",
      color: "primary.main",
      disabledBorderColor: "gray.700",
      disabledColor: "gray.600",
      hoverBackground: "primary.darker",
      activeBackground: "primary.light",
    },
  },
  proposalChip: {
    depositPeriod: {
      bg: "accent.darker",
    },
    votingPeriod: {
      bg: "accent.dark",
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
      bg: "accent.main",
      color: "gray.100",
    },
    disabled: {
      bg: "gray.500",
      color: "background.main",
    },
  },
  tag: {
    signer: {
      bg: "accent.darker",
      color: "text.main",
    },
    related: {
      bg: "primary.dark",
      color: "gray.900",
    },
  },
  voteParticipations: {
    voted: "accent.main",
    votedAbstain: "accent.darker",
    didNotVote: "gray.700",
  },
  recentBlocks: {
    signed: "secondary.main",
    proposed: "primary.main",
    missed: "error.dark",
  },
};

export const SEI_THEME = generateTheme(SEI_BASE_THEME, SEI_COMPONENT_CONFIG);
