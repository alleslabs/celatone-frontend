import { Flex, Image } from "@chakra-ui/react";

import { AppMenu } from "../AppMenu";
import { SearchComponent } from "../search";
import { SectionWrapper } from "../SectionWrapper";
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
            alt="Scan"
            src={
              isInitia
                ? "https://assets.alleslabs.dev/integrations/initia/logo_mobile.png"
                : theme.branding.logo
            }
            maxHeight={isInitia ? "24px" : "auto"}
            minWidth={isInitia ? "auto" : "128px"}
            width={isInitia ? "auto" : "128px"}
            maxWidth="128px"
            mx={4}
            objectFit="contain"
            backgroundPosition="left"
            transition="all 0.25s ease-in-out"
            _hover={{ cursor: "pointer", opacity: 0.85 }}
          />
        </AppLink>
      </SectionWrapper>
      <Flex h="full">
        <SectionWrapper>
          <SearchComponent />
        </SectionWrapper>
        <SectionWrapper borderRight={false}>
          <NavDrawer />
        </SectionWrapper>
      </Flex>
    </Flex>
  );
};

export default MobileHeader;
