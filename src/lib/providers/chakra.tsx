import { ChakraProvider as Provider } from "@chakra-ui/react";

import customTheme from "lib/styles/theme";

export const ChakraProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider theme={customTheme}>{children}</Provider>
);
