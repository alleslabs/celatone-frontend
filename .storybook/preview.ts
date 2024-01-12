import type { Preview } from "@storybook/react";
import { customTheme } from "../src/lib/styles/theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chakra: {
      theme: customTheme,
    },
  },
};

export default preview;
