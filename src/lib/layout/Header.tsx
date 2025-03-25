import { Flex, Image } from "@chakra-ui/react";

import { InitiaAppMenu } from "@initia/react-app-shell";
import { SUPPORTED_NETWORK_TYPES } from "env";
import { useCelatoneApp, useInitia } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { FaucetButton } from "lib/components/button";
import { WalletSection } from "lib/components/wallet-section";

import { NetworkMenu } from "./network-menu";
import { SearchComponent } from "./search";
import { SectionWrapper } from "./SectionWrapper";

const Header = () => {
  const {
    theme,
    chainConfig: {
      extra: { faucetUrl },
    },
  } = useCelatoneApp();
  const isInitia = useInitia();
  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      minH="64px"
    >
      <Flex h="full">
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
        <SectionWrapper minW="171px">
          <AppLink href="/">
            <Image
              src={theme.branding.logo}
              alt="Scan"
              minH="24px"
              h="24px"
              maxH="24px"
              // minWidth="139px"
              // width="139px"
              // maxWidth="139px"
              transition="all 0.25s ease-in-out"
              _hover={{ cursor: "pointer", opacity: 0.85 }}
              // mx={4}
            />
          </AppLink>
        </SectionWrapper>
      </Flex>
      <SectionWrapper w="full">
        <SearchComponent />
      </SectionWrapper>
      <Flex h="full">
        {faucetUrl && (
          <SectionWrapper>
            <FaucetButton faucetUrl={faucetUrl} />
          </SectionWrapper>
        )}
        <SectionWrapper>
          <NetworkMenu />
        </SectionWrapper>
        <SectionWrapper minW="204px">
          <WalletSection />
        </SectionWrapper>
      </Flex>
    </Flex>
  );
};

export default Header;
