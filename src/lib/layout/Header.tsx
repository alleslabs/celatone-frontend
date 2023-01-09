import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  List,
  FormControl,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdSearch } from "react-icons/md";

import { WalletSection } from "lib/components/Wallet";
import { CHAIN_NAMES } from "lib/data";
import { useValidateAddress } from "lib/hooks";
import { isCodeId, isTxHash } from "lib/utils/validate";

type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID";

const NOT_FOUND =
  "Matches not found. Please check your spelling or make sure you have selected the correct network.";
const NOT_SUPPORTED =
  "We currently only support searching by Contract Address and Code ID.";

const getRoute = (type: SearchResultType) => {
  switch (type) {
    case "Code ID":
      return "/code";
    case "Contract Address":
      return "/contract";
    default:
      return null;
  }
};

const Header = () => {
  const { currentChainRecord, setCurrentChain, getChainRecord } = useWallet();
  const router = useRouter();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResultType[]>([]);

  useEffect(() => {
    const res: SearchResultType[] = [];
    if (isCodeId(search)) res.push("Code ID");
    if (!validateContractAddress(search)) res.push("Contract Address");
    if (!validateUserAddress(search)) res.push("Wallet Address");
    if (isTxHash(search)) res.push("Transaction Hash");
    // TODO: add proposal ID
    setResults(res);
  }, [search, validateContractAddress, validateUserAddress]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const handleSelectResult = (type?: SearchResultType) => {
    const route = type ? getRoute(type) : null;
    if (route) router.push({ pathname: `${route}/${search}` });
  };

  const renderResultItem = (type?: SearchResultType) => {
    // eslint-disable-next-line no-nested-ternary
    const text = type ? (getRoute(type) ? type : NOT_SUPPORTED) : NOT_FOUND;
    const route = type ? getRoute(type) : null;

    return (
      <ListItem p={2} borderBottomColor="divider.main">
        <Text variant="body2" fontWeight="500" color="gray.500" p="6px">
          {text}
        </Text>
        {route && (
          <Text
            variant="body2"
            p="6px"
            _hover={{ bg: "gray.800", cursor: "pointer" }}
            onClick={() => handleSelectResult(type)}
          >
            {search}
          </Text>
        )}
      </ListItem>
    );
  };

  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      px={6}
      gap="48px"
    >
      <Link href="/">
        <Image
          src="/celatone-logo.svg"
          alt="Celatone"
          width={120}
          height={24}
        />
      </Link>
      <FormControl>
        <InputGroup>
          <Input
            value={search}
            h="36px"
            onChange={handleSearchChange}
            placeholder="Search by Contract Address or Code ID"
            focusBorderColor="primary.main"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelectResult(results.at(0));
            }}
            _placeholder={{ color: "#A9A9A9" }}
          />
          <InputRightElement pointerEvents="none" h="full">
            <Icon as={MdSearch} w={5} h={5} color="gray.600" />
          </InputRightElement>
        </InputGroup>
        {search && (
          <List
            borderRadius="4px"
            bg="gray.900"
            position="absolute"
            zIndex="2"
            w="full"
            top="50px"
            maxH="195px"
            overflow="scroll"
            shadow="dark-lg"
          >
            {!results.length
              ? renderResultItem()
              : results.map((res) => renderResultItem(res))}
          </List>
        )}
      </FormControl>
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
