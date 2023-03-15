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
    main: "#111117",
    overlay: "rgba(17, 17, 23, 0.7)",
  },
  text: {
    main: "#F7F2FE",
    dark: "#ADADC2",
    disabled: "#8A8AA5",
  },
  violet: {
    main: "#5942F3",
    light: "#9793F3",
    lighter: "#DCDBFB",
    dark: "#3E38B0",
    darker: "#292676",
    background: "#181733",
  },
  honeydew: {
    main: "#C6E141",
    light: "#DDED8D",
    lighter: "#E8F3B3",
    dark: "#95A931",
    darker: "#637121",
    background: "#3D470B",
  },
  lilac: {
    main: "#D8BEFC",
    light: "#E8D8FD",
    dark: "#A28FBD",
    darker: "#6C5F7E",
    background: "#36303F",
  },
  pebble: {
    100: "#F7F2FE",
    400: "#ADADC2",
    500: "#8A8AA5",
    600: "#68688A",
    700: "#343445",
    800: "#272734",
    900: "#1A1A22",
  },
};

export const colors = {
  ...extendedColors,
};
