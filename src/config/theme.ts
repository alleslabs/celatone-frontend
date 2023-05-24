import type { ThemeConfig } from "./type";

export const DEFAULT_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/branding/logo/logo.svg",
    favicon: "https://assets.alleslabs.dev/branding/favicon.ico",
    seo: {
      appName: "celatone",
      title: "Celatone Explorer for Cosmos chain",
      description: "A smart contract powered explorer for the Cosmos.",
      image: "https://assets.alleslabs.dev/branding/celatone-cover.jpg",
      twitter: {
        handle: "@celatone_",
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
      url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
      name: "Space Grotesk, sans-serif",
    },
  },
  colors: {
    gradient: {
      main: "linear(to-tr, #5235EF, #6145FC)",
    },
    error: {
      main: "#FF666E",
      light: "#FF8086",
      dark: "#b43e44",
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
      main: "#111117",
      overlay: "rgba(17, 17, 23, 0.7)",
    },
    text: {
      main: "#F7F2FE",
      dark: "#ADADC2",
      disabled: "#8A8AA5",
    },
    primary: {
      main: "#5942F3",
      light: "#9793F3",
      lighter: "#DCDBFB",
      dark: "#3E38B0",
      darker: "#292676",
      background: "#181733",
    },
    secondary: {
      main: "#D8BEFC",
      light: "#E8D8FD",
      dark: "#A28FBD",
      darker: "#6C5F7E",
      background: "#36303F",
    },
    accent: {
      main: "#C6E141",
      light: "#DDED8D",
      lighter: "#E8F3B3",
      dark: "#95A931",
      darker: "#637121",
      background: "#3D470B",
    },
    gray: {
      100: "#F7F2FE",
      400: "#ADADC2",
      500: "#8A8AA5",
      600: "#68688A",
      700: "#343445",
      800: "#272734",
      900: "#1A1A22",
    },
  },
  jsonTheme: "monokai",
  illustration: {
    error: "https://assets.alleslabs.dev/illustration/404.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/illustration/search-not-found.svg",
    searchEmpty: "https://assets.alleslabs.dev/illustration/search-empty.svg",
    disconnected: "https://assets.alleslabs.dev/illustration/disconnected.svg",
  },
  socialMedia: {
    website: "https://celat.one/",
    github: "https://github.com/alleslabs",
    twitter: "https://twitter.com/celatone_",
    medium: "https://blog.alleslabs.com/",
    telegram: "https://t.me/celatone_announcements",
  },
};

export const OSMOSIS_THEME: ThemeConfig = {
  branding: {
    logo: "https://assets.alleslabs.dev/integrations/osmosis/logo.png",
    favicon: "https://assets.alleslabs.dev/integrations/osmosis/favicon.ico",
    seo: {
      appName: "osmoscan",
      title: "OsmoScan | Osmosis Explorer powered by Celatone",
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
      dark: "#b43e44",
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
  },
  jsonTheme: "pastel_on_dark",
  illustration: {
    error:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/404.svg",
    searchNotFound:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/search-not-found.svg",
    searchEmpty:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/search-empty.svg",
    disconnected:
      "https://assets.alleslabs.dev/integrations/osmosis/illustration/disconnected.svg",
  },
  footer: {
    logo: "https://assets.alleslabs.dev/integrations/osmosis/logo.png",
    description:
      "A Smart Contract Explorer for Osmosis | Explore, deploy, execute, and query smart contracts on Osmosis from a user-friendly web UI",
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
