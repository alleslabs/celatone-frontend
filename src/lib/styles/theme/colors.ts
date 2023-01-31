import type { DeepPartial, Theme } from "@chakra-ui/react";

type BasicColor = Record<
  string,
  Partial<{
    main: string;
    light: string;
    dark: string;
    lighter: string;
    darker: string;
    disabled: string;
    button: string;
    background: string;
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
  // primary: {
  //   main: "#f48fb1",
  //   light: "#f6a5c0",
  //   dark: "#aa647b",
  // },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
  },
  warning: {
    main: "#ffa726",
    light: "#ffb74d",
    dark: "#f57c00",
  },
  info: {
    main: "#29b6f6",
    light: "#4fc3f7",
    dark: "#0288d1",
  },
  success: {
    main: "#66bb6a",
    light: "#81c784",
    dark: "#388e3c",
  },
  background: {
    main: "#111117",
  },
  text: {
    main: "#F7F2FE",
    dark: "#ADADC2",
    disabled: "#8A8AA5",
  },
  divider: {
    main: "rgba(255,255,255,0.12)",
  },
  overlay: {
    main: "rgba(23,23,23,0.6)",
  },
  hover: {
    main: "rgba(255,255,255,0.20)",
    dark: "rgba(255,255,255,0.10)",
  },
  violet: {
    main: "#5942F3",
    light: "#9793F3",
    lighter: "#DCDBFB",
    dark: "#3E38B0",
    darker: "#292676",
    background: "rgba(41, 38, 118,0.7)",
  },
  honeydew: {
    main: "#C6E141",
    light: "#DDED8D",
    lighter: "#E8F3B3",
    dark: "#95A931",
    darker: "#637121",
    background: "rgba(198, 225, 65, 0.2)",
  },
  lilac: {
    main: "#D8BEFC",
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

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {
  gray: {
    50: "#fafafa",
    100: "f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#2E2E2E",
    900: "#212121",
  },
};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
