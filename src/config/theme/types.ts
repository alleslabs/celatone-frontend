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
  fonts: {
    heading: {
      url: string;
      name: string;
    };
    body: {
      url: string;
      name: string;
    };
  };
  colors: {
    gradient?: {
      main: string;
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
    success: {
      main: string;
      light: string;
      dark: string;
      background: string;
    };
    background: {
      main: string;
      overlay: string;
    };
    text: {
      main: string;
      dark: string;
      disabled: string;
    };
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
  };
  illustration: {
    error: string;
    searchNotFound: string;
    searchEmpty: string;
    disconnected: string;
  };
  jsonTheme: "monokai" | "one_dark" | "pastel_on_dark";
  footer?: {
    logo: string;
    description: string;
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
    facebook?: string;
  };
};
