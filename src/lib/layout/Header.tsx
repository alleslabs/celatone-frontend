import { Flex, Image } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useCelatoneApp, useInitia } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { FaucetBtn } from "lib/components/button";
import { WalletSection } from "lib/components/Wallet";

import { AppMenu } from "./AppMenu";
import { NetworkMenu } from "./NetworkMenu";
import Searchbar from "./Searchbar";

export const SectionWrapper = ({
  children,
  minW = "auto",
  w = "auto",
  justifyContent = "center",
}: {
  children: ReactNode;
  minW?: string;
  w?: string;
  justifyContent?: string;
}) => (
  <Flex
    borderRight="1px solid"
    borderColor="gray.700"
    h="full"
    alignItems="center"
    w={w}
    minW={minW}
    justifyContent={justifyContent}
  >
    {children}
  </Flex>
);

const Header = () => {
  const { theme } = useCelatoneApp();
  const {
    chainConfig: {
      features: {
        faucet: { enabled: isFaucetEnabled },
      },
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
            <AppMenu />
          </SectionWrapper>
        )}
        <SectionWrapper>
          <AppLink href="/">
            <Image
              src={theme.branding.logo}
              alt="Celatone"
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
        <Searchbar />
      </SectionWrapper>
      <Flex h="full">
        {isFaucetEnabled && (
          <SectionWrapper>
            <FaucetBtn />
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
