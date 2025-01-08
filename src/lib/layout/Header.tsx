import { Flex, Image } from "@chakra-ui/react";

import { useCelatoneApp, useInitia } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { FaucetButton } from "lib/components/button";
import { WalletSection } from "lib/components/wallet-section";

import { AppMenu } from "./AppMenu";
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
      width="100vw"
      align="center"
      as="header"
      height="full"
      justifyContent="space-between"
    >
      <Flex h="full">
        {isInitia && (
          <SectionWrapper minW="64px">
            <AppMenu />
          </SectionWrapper>
        )}
        <SectionWrapper minW={isInitia ? "auto" : "234px"}>
          <AppLink href="/">
            <Image
              maxWidth="139px"
              minWidth="139px"
              width="139px"
              alt="Celatone"
              mx={4}
              src={theme.branding.logo}
              _hover={{ cursor: "pointer", opacity: 0.85 }}
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
        <SectionWrapper>
          <WalletSection />
        </SectionWrapper>
      </Flex>
    </Flex>
  );
};

export default Header;
