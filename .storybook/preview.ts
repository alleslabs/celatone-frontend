import type { Preview } from "@storybook/react";
import { customTheme } from "../src/lib/styles/theme";

export const pamaraters = {
  chakra: {
    theme: customTheme,
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
