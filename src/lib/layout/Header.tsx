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
    chainConfig: {
      extra: { faucetUrl },
    },
    theme,
  } = useCelatoneApp();
  const isInitia = useInitia();
  return (
    <Flex
      align="center"
      as="header"
      height="full"
      justifyContent="space-between"
      minH="64px"
      width="100vw"
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
              _hover={{ cursor: "pointer", opacity: 0.85 }}
              alt="Scan"
              h="24px"
              maxH="24px"
              minH="24px"
              src={theme.branding.logo}
              transition="all 0.25s ease-in-out"
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
