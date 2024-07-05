import { Flex, Image } from "@chakra-ui/react";

import { AppMenu } from "../AppMenu";
import { SectionWrapper } from "../Header";
import Searchbar from "../Searchbar";
import { useCelatoneApp, useInitia } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";

import { NavDrawer } from "./NavDrawer";

const MobileHeader = () => {
  const { theme } = useCelatoneApp();
  const isInitia = useInitia();
  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
    >
      {isInitia && (
        <SectionWrapper minW="64px">
          <AppMenu trigger="click" />
        </SectionWrapper>
      )}
      <SectionWrapper minW="64px" w="full" justifyContent="start">
        <AppLink href="/">
          <Image
            src={theme.branding.logo}
            alt="Celatone"
            minWidth="128px"
            width="128px"
            maxWidth="128px"
            mx={4}
            transition="all 0.25s ease-in-out"
            _hover={{ cursor: "pointer", opacity: 0.85 }}
          />
        </AppLink>
      </SectionWrapper>
      <Flex h="full">
        <SectionWrapper>
          <Searchbar />
        </SectionWrapper>
        <SectionWrapper>
          <NavDrawer />
        </SectionWrapper>
      </Flex>
    </Flex>
  );
};

export default MobileHeader;
