import type { DeepPartial, Theme } from "@chakra-ui/react";

import { CURR_THEME } from "env";

export const fonts: DeepPartial<Theme["fonts"]> = {
  body: CURR_THEME.fonts.body.name,
  heading: CURR_THEME.fonts.heading.name,
};
