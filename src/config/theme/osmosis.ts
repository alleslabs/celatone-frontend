import type { ThemeConfig } from "./types";

export const OSMOSIS_THEME: ThemeConfig = {
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
  fonts: {
    heading: {
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap",
      name: "Poppins, serif",
    },
    body: {
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
      name: "Inter, sans-serif",
    },
  },
  colors: {
    gradient: {
      main: "linear(55deg, #462ADF 0%,#5235EF 40%, #B72AAB 100%)",
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
      main: "#090524",
      overlay: "rgba(14, 9, 49, 0.7)",
    },
    text: {
      main: "#F2F2F4",
      dark: "#A09ACA",
      disabled: "#736DA0",
    },
    primary: {
      main: "#5235EF",
      light: "#765CFF",
      lighter: "#8481F8",
      dark: "#462ADF",
      darker: "#3A1FCA",
      background: "#201865",
    },
    secondary: {
      main: "#8481F8",
      light: "#9B99FF",
      dark: "#6A67EA",
      darker: "#5855DB",
      background: "#2F306A",
    },
    accent: {
      main: "#DD69D3",
      light: "#E58BDD",
      lighter: "#ECACE7",
      dark: "#CA2EBD",
      darker: "#B72AAB",
      background: "#431152",
    },
    gray: {
      100: "#F2F2F4",
      400: "#8D87B8",
      500: "#736DA0",
      600: "#5F588F",
      700: "#464075",
      800: "#282750",
      900: "#140F34",
    },
    overlay: {
      transaction: "rgba(217, 217, 217, 0.1)",
      block: "rgba(32, 135, 255, 0.1)",
      validator: "rgba(255, 157, 189, 0.1)",
      proposal: "rgba(74, 194, 255, 0.1)",
      code: "rgba(161, 255, 88, 0.1)",
      contract: "rgba(124, 118, 255, 0.1)",
      account: "rgba(105, 255, 255, 0.1)",
      pool: "rgba(255, 159, 129, 0.1)",
    },
  },
  tag: {
    signer: {
      bg: "accent.darker",
      color: "inherit",
    },
    related: {
      bg: "primary.dark",
      color: "text.main",
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
