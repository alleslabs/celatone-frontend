import { Flex, Image } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { FaucetBtn } from "lib/components/button";
import { WalletSection } from "lib/components/Wallet";

import { NetworkMenu } from "./NetworkMenu";
import Searchbar from "./Searchbar";

const Header = () => {
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
          minWidth="152px"
          width="152px"
          maxWidth="152px"
          mr={8}
          transition="all 0.25s ease-in-out"
          _hover={{ cursor: "pointer", opacity: 0.85 }}
        />
      </AppLink>
      <Searchbar />
      <Flex gap={4}>
        <FaucetBtn />
        <NetworkMenu />
        <WalletSection />
      </Flex>
    </Flex>
  );
};

export default Header;
