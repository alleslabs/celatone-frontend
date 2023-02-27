import { IconButton, useColorMode } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon/CustomIcon";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="theme toggle"
      icon={
        colorMode === "light" ? (
          <CustomIcon name="mode-dark" />
        ) : (
          <CustomIcon name="mode-light" />
        )
      }
      onClick={toggleColorMode}
    />
  );
};

export default ThemeToggle;
