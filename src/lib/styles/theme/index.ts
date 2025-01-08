import { extendTheme } from "@chakra-ui/react";

import { DEFAULT_THEME } from "config/theme/default";

import { components } from "./components";
import { config } from "./config";
import { fonts } from "./fonts";

export default extendTheme({
  fonts,
  config,
  components,
  colors: DEFAULT_THEME.colors,
});
