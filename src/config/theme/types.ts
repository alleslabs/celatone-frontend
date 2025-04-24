export type ThemeConfig = {
  branding: {
    favicon: string;
    logo: string;
    seo: {
      appName: string;
      description: string;
      image: string;
      title: string;
      x: {
        cardType: string;
        handle: string;
      };
    };
  };
  colors: {
    background: {
      main: string;
      overlay: string;
    };
    error: {
      background: string;
      dark: string;
      light: string;
      main: string;
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
    primary: {
      background: string;
      dark: string;
      darker: string;
      light: string;
      lighter: string;
      main: string;
    };
    secondary: {
      background: string;
      dark: string;
      darker: string;
      light: string;
      lighter: string;
      main: string;
    };
    success: {
      background: string;
      dark: string;
      light: string;
      main: string;
    };
    text: {
      dark: string;
      disabled: string;
      main: string;
    };
    warning: {
      background: string;
      dark: string;
      light: string;
      main: string;
    };
  };
  footer?: {
    description: string;
    iconStyle: "regular" | "rounded";
    logo: string;
  };
  illustration: {
    "404": string;
    disconnected: string;
    error: string;
    searchEmpty: string;
    searchNotFound: string;
  };
  jsonTheme: "monokai" | "one_dark" | "pastel_on_dark";
  socialMedia?: {
    discord?: string;
    github?: string;
    linkedin?: string;
    medium?: string;
    reddit?: string;
    telegram?: string;
    website?: string;
    x?: string;
  };
};

export type ComponentConfig = {
  button: {
    outlinePrimary: {
      activeBackground: string;
      borderColor: string;
      color: string;
      disabledBorderColor: string;
      disabledColor: string;
      hoverBackground: string;
    };
    primary: {
      activeBackground: string;
      background: string;
      color: string;
      disabledBackground: string;
      disabledColor: string;
      hoverBackground: string;
    };
  };
  proposalChip: {
    cancelled: {
      bg: string;
    };
    depositFailed: {
      bg: string;
    };
    depositPeriod: {
      bg: string;
    };
    failed: {
      bg: string;
    };
    passed: {
      bg: string;
    };
    rejected: {
      bg: string;
    };
    votingPeriod: {
      bg: string;
    };
  };
  recentBlocks: {
    missed: string;
    proposed: string;
    signed: string;
  };
  stepper: {
    active: { bg: string; color: string };
    disabled: { bg: string; color: string };
  };
  tag: {
    related: {
      bg: string;
      color: string;
    };
    signer: {
      bg: string;
      color: string;
    };
  };
  voteParticipations: {
    didNotVote: string;
    voted: string;
    votedAbstain: string;
  };
};
