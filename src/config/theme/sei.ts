/* eslint-disable sonarjs/no-duplicate-string */
import type { ThemeConfig } from "config/theme/types";

export const SEI_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/sei/logo.svg",
    favicon: "https://assets.alleslabs.dev/integrations/sei/favicon.ico",
    seo: {
      appName: "SeiScan",
      title: "SeiScan powered by Celatone",
      description:
        "Explore, deploy, execute, and query smart contracts on Sei from a user-friendly web UI",
      image: "https://assets.alleslabs.dev/integrations/sei/cover.jpg",
      twitter: {
        handle: "@SeiNetwork",
        cardType: "summary_large_image",
      },
    },
  },
  fonts: {
    heading: {
      url: "https://fonts.cdnfonts.com/css/satoshi?styles=135009,135005,135007,135002,135000",
      name: "Satoshi, sans-serif",
    },
    body: {
      url: "https://fonts.cdnfonts.com/css/satoshi?styles=135009,135005,135007,135002,135000",
      name: "Satoshi, sans-serif",
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
  tag: {
    signer: {
      bg: "accent.darker",
      color: "inherit",
    },
    related: {
      bg: "primary.dark",
      color: "gray.900",
    },
  },
  proposalChip: {
    depositPeriod: {
      bg: "accent.darker",
      color: "inherit",
    },
    votingPeriod: {
      bg: "accent.dark",
      color: "inherit",
    },
    failed: {
      bg: "error.dark",
      color: "inherit",
    },
    rejected: {
      bg: "error.dark",
      color: "inherit",
    },
    passed: {
      bg: "success.dark",
      color: "inherit",
    },
    cancelled: {
      bg: "error.darker",
      color: "inherit",
    },
    depositFailed: {
      bg: "gray.700",
      color: "inherit",
    },
  },
  voteParticipations: {
    voted: "accent.main",
    votedAbstain: "accent.darker",
    didNotVote: "gray.700",
  },
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
    overview: {
      // Fill image url
      main: "",
    },
  },
  footer: {
    logo: "https://www.sei.io/_next/static/media/logo-light.1249fa55.svg",
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
