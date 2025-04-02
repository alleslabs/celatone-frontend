import type { Preview } from "@storybook/react";

import defaultTheme from "../src/lib/styles/theme";

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
      theme: defaultTheme,
    },
  },
};

export default preview;
