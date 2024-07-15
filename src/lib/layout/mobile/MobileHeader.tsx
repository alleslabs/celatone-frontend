import { Flex, Image } from "@chakra-ui/react";

import { SearchComponent } from "../search/SearchComponent";
import { useCelatoneApp } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";

import { NavDrawer } from "./NavDrawer";

const MobileHeader = () => {
  const { theme } = useCelatoneApp();
  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      px={6}
      mb={1}
      gap={6}
    >
      <AppLink href="/">
        <Image
          src={theme.branding.logo}
          alt="Celatone"
          minWidth="128px"
          width="128px"
          maxWidth="128px"
          mr={8}
          transition="all 0.25s ease-in-out"
          _hover={{ cursor: "pointer", opacity: 0.85 }}
        />
      </AppLink>
      <Flex gap={2}>
        <SearchComponent />
        <NavDrawer />
      </Flex>
    </Flex>
  );
};

export default MobileHeader;
