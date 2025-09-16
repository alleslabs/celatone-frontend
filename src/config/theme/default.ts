import type { ComponentConfig, ThemeConfig } from "./types";

import { colorScheme } from "./colors";
import { generateTheme } from "./utils";

const DEFAULT_BASE_THEME: ThemeConfig = {
  branding: {
    favicon: "https://assets.alleslabs.dev/celatone-brand/favicon.ico",
    logo: "/celatone.svg",
    seo: {
      appName: "Celatone",
      description: "All in one place.",
      image:
        "https://assets.alleslabs.dev/celatone-brand/socials/celatone-ogimg.jpg",
      title: "Celatone Explorer",
      x: {
        cardType: "summary_large_image",
        handle: "@celatone_",
      },
    },
  },
  colors: colorScheme,
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

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = {
  button: {
    outlinePrimary: {
      activeBackground: "primary.background",
      borderColor: "primary.main",
      color: "primary.main",
      disabledBorderColor: "primary.background",
      disabledColor: "primary.darker",
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
      bg: "primary.darker",
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

export const DEFAULT_THEME = generateTheme(
  DEFAULT_BASE_THEME,
  DEFAULT_COMPONENT_CONFIG
);
