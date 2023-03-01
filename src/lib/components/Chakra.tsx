import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import customTheme from "lib/styles/theme";

interface ChakraProps {
  children: ReactNode;
}

export const Chakra = ({ children }: ChakraProps) => (
  <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
);
