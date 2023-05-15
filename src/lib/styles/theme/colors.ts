type BasicColor = Record<
  string,
  Partial<{
    main: string;
    light: string;
    dark: string;
    lighter: string;
    darker: string;
    disabled: string;
    background: string;
    overlay: string;
    100: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }>
>;

/** extend additional color here */
const extendedColors: BasicColor = {
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
  info: {
    main: "#29B6F6",
  },
  background: {
    main: "#000E13",
    overlay: "rgba(17, 17, 23, 0.7)",
  },
  text: {
    main: "#FCFCFD",
    dark: "#B9BDC7",
    disabled: "#3E5163",
  },
  violet: {
    main: "#F0E3CF",
    light: "#FAF6EF",
    lighter: "#FAF6EF",
    dark: "#303838",
    darker: "#303838",
    background: "#303838",
  },
  honeydew: {
    main: "#6C80B2",
    light: "#8797C0",
    lighter: "#8797C0",
    dark: "#516799",
    darker: "#3F4F78",
    background: "#203043",
  },
  lilac: {
    main: "#6C80B2",
    light: "#8797C0",
    dark: "#184354",
    darker: "#3F4F78",
    background: "#203043",
  },
  pebble: {
    100: "#FCFCFD",
    400: "#B9BDC7",
    500: "#777E90",
    600: "#3E5163",
    700: "#1D343F",
    800: "#132730",
    900: "#0C1C23",
  },
};

export const colors = {
  ...extendedColors,
};
