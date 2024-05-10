/* eslint-disable sonarjs/no-duplicate-string */
import type { ComponentConfig, ThemeConfig } from "./types";
import { generateTheme } from "./utils";

const OSMOSIS_BASE_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/osmosis/logo.svg",
    favicon: "https://assets.alleslabs.dev/integrations/osmosis/favicon.ico",
    seo: {
      appName: "osmoscan",
      title: "OsmoScan powered by Celatone",
      description:
        "Explore, deploy, execute, and query smart contracts on Osmosis from a user-friendly web UI",
      image:
        "https://uploads-ssl.webflow.com/62825f7982e99cdbe7e37258/63ffa0f2d03be626855120ae_image-_4_.webp",
      twitter: {
        handle: "@osmosiszone",
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
    text: {
      main: "#F2F2F4",
      dark: "#B0AADC",
      disabled: "#8D87B8",
    },
    primary: {
      lighter: "#A5A3FF",
      light: "#8481F8",
      main: "#5235EF",
      dark: "#3E21DB",
      darker: "#260BB6",
      background: "#201865",
    },
    secondary: {
      light: "#A5A3FF",
      main: "#8481F8",
      dark: "#5235EF",
      darker: "#462ADF",
      background: "#201865",
    },
    accent: {
      lighter: "#ECACE7",
      light: "#E58BDD",
      main: "#DD69D3",
      dark: "#CA2EBD",
      darker: "#B72AAB",
      background: "#711B75",
    },
    gray: {
      100: "#F2F2F4",
      400: "#B0AADC",
      500: "#8D87B8",
      600: "#736DA0",
      700: "#4B447B",
      800: "#3C356D",
      900: "#201B43",
    },
    background: {
      main: "#140F34",
      overlay: "rgba(14, 9, 49, 0.7)",
    },
  },
  jsonTheme: "pastel_on_dark",
  illustration: {
    "404":
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/404.svg",
    error:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/error.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/search-not-found.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/search-empty.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/disconnected.svg",
    overview: {
      // Fill image url
      main: "",
    },
  },
  footer: {
    logo: "https://assets.alleslabs.dev/integrations/osmosis/logo.png",
    description:
      "A Smart Contract Explorer for Osmosis | Explore, deploy, execute, and query smart contracts on Osmosis from a user-friendly web UI",
    iconStyle: "rounded",
  },
  socialMedia: {
    website: "https://osmosis.zone/",
    github: "https://github.com/osmosis-labs/osmosis",
    discord: "https://discord.com/invite/osmosis",
    twitter: "https://twitter.com/osmosiszone",
    medium: "https://medium.com/osmosis",
    telegram: "https://t.me/osmosis_chat",
    reddit: "https://www.reddit.com/r/OsmosisLab/",
  },
};

const OSMOSIS_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    primary: {
      background: "primary.main",
      color: "gray.100",
      disabledBackground: "primary.background",
      disabledColor: "gray.600",
      hoverBackground: "primary.dark",
      activeBackground: "primary.light",
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
      bg: "accent.darker",
      color: "text.main",
    },
    related: {
      bg: "primary.dark",
      color: "text.main",
    },
  },
  voteParticipations: {
    voted: "primary.main",
    votedAbstain: "primary.darker",
    didNotVote: "gray.700",
  },
};

export const OSMOSIS_THEME = generateTheme(
  OSMOSIS_BASE_THEME,
  OSMOSIS_COMPONENT_CONFIG
);
