import { extendTheme, ChakraProvider as Provider } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { components } from "lib/styles/theme/components";
import { config } from "lib/styles/theme/config";
import { fonts } from "lib/styles/theme/fonts";

export const ChakraProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useCelatoneApp();
  const customTheme = extendTheme({
    fonts,
    config,
    components,
    colors: theme.colors,
  });
  return <Provider theme={customTheme}>{children}</Provider>;
};
