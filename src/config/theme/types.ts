export type ThemeConfig = {
  branding: {
    logo: string;
    favicon: string;
    seo: {
      appName: string;
      title: string;
      description: string;
      image: string;
      twitter: {
        handle: string;
        cardType: string;
      };
    };
  };
  colors: {
    primary: {
      main: string;
      light: string;
      lighter: string;
      dark: string;
      darker: string;
      background: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      darker: string;
      background: string;
    };
    accent: {
      main: string;
      light: string;
      lighter: string;
      dark: string;
      darker: string;
      background: string;
    };
    gray: {
      100: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    text: {
      main: string;
      dark: string;
      disabled: string;
    };
    background: {
      main: string;
      overlay: string;
    };
    success: {
      main: string;
      light: string;
      dark: string;
      background: string;
    };
    error: {
      main: string;
      light: string;
      dark: string;
      background: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
      background: string;
    };
  };
  illustration: {
    "404": string;
    error: string;
    searchNotFound: string;
    searchEmpty: string;
    disconnected: string;
    overview: {
      main: string;
      secondary?: string;
    };
  };
  jsonTheme: "monokai" | "one_dark" | "pastel_on_dark";
  footer?: {
    logo: string;
    description: string;
    iconStyle: "rounded" | "regular";
  };
  socialMedia?: {
    website?: string;
    github?: string;
    discord?: string;
    twitter?: string;
    medium?: string;
    telegram?: string;
    reddit?: string;
    linkedin?: string;
  };
};

export type ComponentConfig = {
  button: {
    primary: {
      background: string;
      color: string;
      disabledBackground: string;
      disabledColor: string;
      hoverBackground: string;
      activeBackground: string;
    };
    outlinePrimary: {
      borderColor: string;
      color: string;
      disabledBorderColor: string;
      disabledColor: string;
      hoverBackground: string;
      activeBackground: string;
    };
  };
  proposalChip: {
    depositPeriod: {
      bg: string;
    };
    votingPeriod: {
      bg: string;
    };
    failed: {
      bg: string;
    };
    rejected: {
      bg: string;
    };
    passed: {
      bg: string;
    };
    cancelled: {
      bg: string;
    };
    depositFailed: {
      bg: string;
    };
  };
  stepper: {
    active: { bg: string; color: string };
    disabled: { bg: string; color: string };
  };
  tag: {
    signer: {
      bg: string;
      color: string;
    };
    related: {
      bg: string;
      color: string;
    };
  };
  voteParticipations: {
    voted: string;
    votedAbstain: string;
    didNotVote: string;
  };
  recentBlocks: {
    signed: string;
    proposed: string;
    missed: string;
  };
};
