import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

import { WalletSection } from "lib/components/Wallet";
import { CHAIN_NAMES } from "lib/data";

const Header = () => {
  const { currentChainRecord, setCurrentChain, getChainRecord } = useWallet();

  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      px={6}
    >
      <Link href="/">
        <Image
          src="/celatone-logo.svg"
          alt="Celatone"
          width={120}
          height={24}
        />
      </Link>
      <Flex gap={2}>
        <Menu>
          <MenuButton
            px={4}
            py="5px"
            transition="all 0.2s"
            borderRadius="4px"
            borderWidth="1px"
            _hover={{ bg: "gray.800" }}
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
              <Icon as={FiChevronDown} />
            </Flex>
          </MenuButton>
          <MenuList>
            {CHAIN_NAMES.map((chainName) => {
              return (
                <MenuItem
                  key={chainName}
                  onClick={() => setCurrentChain(chainName)}
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Text>{getChainRecord(chainName)?.chain.pretty_name}</Text>
                  <Text color="text.dark" fontSize="sm">
                    {getChainRecord(chainName)?.chain.chain_id}
                  </Text>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
        <WalletSection />
      </Flex>
    </Flex>
  );
};

export default Header;
