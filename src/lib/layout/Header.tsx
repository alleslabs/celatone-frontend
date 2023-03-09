import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { useSelectChain } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { FaucetBtn } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { WalletSection } from "lib/components/Wallet";
import { getSupportedChainNames } from "lib/data";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import Searchbar from "./Searchbar";

const Header = () => {
  const { currentChainRecord, currentChainName, getChainRecord } = useWallet();
  const selectChain = useSelectChain();

  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      px={6}
      mb={1}
      gap="24px"
    >
      <AppLink href="/">
        <Image
          src="https://assets.alleslabs.dev/branding/logo/logo.svg"
          alt="Celatone"
          minWidth="152px"
          width="152px"
          maxWidth="152px"
          mr="36px"
          transition="all 0.25s ease-in-out"
          _hover={{ cursor: "pointer", opacity: 0.85 }}
        />
      </AppLink>
      <Searchbar />
      <Flex gap="16px">
        <FaucetBtn />
        <Menu onOpen={() => AmpTrack(AmpEvent.USE_SELECT_NETWORK)}>
          <MenuButton
            pl={4}
            pr={2}
            py="5px"
            borderRadius="8px"
            borderWidth="1px"
            borderColor="pebble.600"
            _hover={{ bg: "pebble.700" }}
            transition="all .25s ease-in-out"
            w="170px"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              display="flex"
            >
              <Text
                textOverflow="ellipsis"
                variant="body2"
                overflow="hidden"
                whiteSpace="nowrap"
                maxW="170px"
              >
                {currentChainRecord?.chain.chain_id}
              </Text>
              <CustomIcon name="chevron-down" />
            </Flex>
          </MenuButton>
          <MenuList zIndex="dropdown">
            {getSupportedChainNames().map((chainName) => (
              <MenuItem
                key={chainName}
                onClick={() => {
                  selectChain(chainName);
                }}
                flexDirection="column"
                alignItems="flex-start"
                _hover={{
                  backgroundColor: "pebble.800",
                }}
                transition="all .25s ease-in-out"
              >
                <Flex justify="space-between" align="center" w="full">
                  <Flex direction="column">
                    <Text variant="body2">
                      {getChainRecord(chainName)?.chain.pretty_name}
                    </Text>
                    <Text color="text.dark" variant="body3">
                      {getChainRecord(chainName)?.chain.chain_id}
                    </Text>
                  </Flex>
                  {chainName === currentChainName && (
                    <CustomIcon name="check" boxSize="3" />
                  )}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <WalletSection />
      </Flex>
    </Flex>
  );
};

export default Header;
