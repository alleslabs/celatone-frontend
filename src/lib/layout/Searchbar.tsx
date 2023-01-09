import {
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  List,
  FormControl,
  Text,
  Icon,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useRef, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

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
  "We currently only support searching by contract address and code ID.";

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

const Searchbar = () => {
  const router = useRouter();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();

  const [search, setSearch] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [results, setResults] = useState<SearchResultType[]>([]);

  const boxRef = useRef<HTMLDivElement>(null);

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
    setDisplayResults(inputValue.length > 0);
  };

  const handleSelectResult = (type?: SearchResultType) => {
    const route = type ? getRoute(type) : null;
    if (route) router.push({ pathname: `${route}/${search}` });
  };

  useOutsideClick({
    ref: boxRef,
    handler: () => setDisplayResults(false),
  });

  const renderResultItem = (type?: SearchResultType) => {
    // TODO: should be removed once all types are supported
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
    <FormControl ref={boxRef}>
      <InputGroup>
        <Input
          value={search}
          h="36px"
          onChange={handleSearchChange}
          placeholder="Search by Contract Address / Code ID"
          focusBorderColor="primary.main"
          _placeholder={{ color: "#A9A9A9" }}
          onFocus={() => setDisplayResults(search.length > 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSelectResult(results.at(0));
          }}
        />
        <InputRightElement pointerEvents="none" h="full">
          <Icon as={MdSearch} w={5} h={5} color="gray.600" />
        </InputRightElement>
      </InputGroup>
      {displayResults && (
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
  );
};

export default Searchbar;
