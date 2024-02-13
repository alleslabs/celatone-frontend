import { ChakraProvider as Provider, extendTheme } from "@chakra-ui/react";
import type { DeepPartial, Theme } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { components } from "lib/styles/theme/components";
import { generateStyle } from "lib/styles/theme/components/button";
import { config } from "lib/styles/theme/config";

const gray600 = "gray.600";
const primaryLight = "primary.light";
const primaryDark = "primary.dark";
const primaryBg = "primary.background";

export const ChakraProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useCelatoneApp();
  const colors = { ...theme.colors };
  const fonts: DeepPartial<Theme["fonts"]> = {
    body: theme.fonts.body.name,
    heading: theme.fonts.heading.name,
  };
  const TempButton = components.Button;
  if (TempButton.variants)
    TempButton.variants.primary = theme.button?.primary
      ? generateStyle({
          basic: {
            background: theme.button.primary.background,
            color: theme.button.primary.color,
            "& span": {
              color: theme.button.primary.color,
            },
          },
          disabled: {
            background: theme.button.primary.disabledBackground,
            color: theme.button.primary.disabledColor,
            "& span": {
              color: theme.button.primary.disabledColor,
            },
          },
          hoverBg: theme.button.primary.hoverBackground,
          activeBg: theme.button.primary.activeBackground,
        })
      : generateStyle({
          basic: {
            background: "primary.main",
            color: "text.main",
            "& span": {
              color: "text.main",
            },
          },
          disabled: {
            background: primaryBg,
            color: gray600,
            "& span": {
              color: gray600,
            },
          },
          hoverBg: primaryDark,
          activeBg: primaryLight,
        });

  const customTheme = extendTheme({
    fonts,
    colors,
    config,
    components: {
      ...components,
      Button: TempButton,
    },
  });
  return <Provider theme={customTheme}>{children}</Provider>;
};
