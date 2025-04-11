import { Flex, Image } from "@chakra-ui/react";
import { InitiaAppMenu } from "@initia/react-app-shell";
import { SUPPORTED_NETWORK_TYPES } from "env";
import { useCelatoneApp, useInitia } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";

import { SearchComponent } from "../search";
import { SectionWrapper } from "../SectionWrapper";
import { NavDrawer } from "./NavDrawer";

const MobileHeader = () => {
  const { theme } = useCelatoneApp();
  const isInitia = useInitia();
  return (
    <Flex
      align="center"
      as="header"
      height="full"
      justifyContent="space-between"
      width="100vw"
    >
      {isInitia && (
        <SectionWrapper minW="64px">
          <InitiaAppMenu
            app="scan"
            subdomain={
              SUPPORTED_NETWORK_TYPES[0] === "mainnet"
                ? undefined
                : SUPPORTED_NETWORK_TYPES[0]
            }
          />
        </SectionWrapper>
      )}
      <SectionWrapper justifyContent="start" minW="64px" w="full">
        <AppLink href="/">
          <Image
            _hover={{ cursor: "pointer", opacity: 0.85 }}
            alt="Scan"
            backgroundPosition="left"
            maxHeight={isInitia ? "24px" : "auto"}
            maxWidth="128px"
            minWidth={isInitia ? "auto" : "128px"}
            mx={4}
            objectFit="contain"
            src={
              isInitia
                ? "https://assets.alleslabs.dev/integrations/initia/logo_mobile.png"
                : theme.branding.logo
            }
            transition="all 0.25s ease-in-out"
            width={isInitia ? "auto" : "128px"}
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
