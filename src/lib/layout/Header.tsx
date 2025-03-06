import { Flex, Image } from "@chakra-ui/react";

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
    >
      <Flex h="full">
        {isInitia && (
          <SectionWrapper minW="64px">
            <div id="app-menu" data-app="scan" />
          </SectionWrapper>
        )}
        <SectionWrapper minW={isInitia ? "auto" : "234px"}>
          <AppLink href="/">
            <Image
              src={theme.branding.logo}
              alt="Scan"
              minWidth="139px"
              width="139px"
              maxWidth="139px"
              transition="all 0.25s ease-in-out"
              _hover={{ cursor: "pointer", opacity: 0.85 }}
              mx={4}
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
        <SectionWrapper>
          <WalletSection />
        </SectionWrapper>
      </Flex>
    </Flex>
  );
};

export default Header;
