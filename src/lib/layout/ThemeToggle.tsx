import { IconButton, useColorMode } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="theme toggle"
      icon={
        <CustomIcon name={colorMode === "light" ? "mode-dark" : "mode-light"} />
      }
      onClick={toggleColorMode}
    />
  );
};

export default ThemeToggle;
