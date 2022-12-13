import type { DeepPartial, Theme } from "@chakra-ui/react";

type BasicColor = Record<
  string,
  Partial<{
    main: string;
    light: string;
    dark: string;
    disabled: string;
    button: string;
  }>
>;

/** extend additional color here */
const extendedColors: BasicColor = {
  primary: {
    main: "#f48fb1",
    light: "#f6a5c0",
    dark: "#aa647b",
  },
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
    main: "#121212",
  },
  text: {
    main: "#fff",
    dark: "rgba(255,255,255,0.7)",
    disabled: "rgba(255,255,255,0.5)",
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
