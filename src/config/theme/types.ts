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
  button?: {
    primary?: {
      background: string;
      color: string;
      disabledBackground: string;
      disabledColor: string;
    };
    outlinePrimary?: {
      borderColor: string;
      color: string;
      disabledBorderColor: string;
      disabledColor: string;
    };
  };
  borderRadius: {
    default: string;
    iconButton: string;
    viewButton: string;
    uploadButton: string;
    tag: string;
    badge: string;
    radio: string;
    indicator: string;
    stepper: string;
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
