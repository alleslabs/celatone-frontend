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
import type { ChangeEvent, KeyboardEvent } from "react";
import { useRef, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { useValidateAddress } from "lib/hooks";
import { AmpTrackUseMainSearch } from "lib/services/amplitude";
import { isCodeId, isTxHash } from "lib/utils";

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

interface ResultItemProps {
  type?: SearchResultType;
  value: string;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}

const getRoute = (type: SearchResultType) => {
  switch (type) {
    case "Code ID":
      return "/code";
    case "Contract Address":
      return "/contract";
    case "Wallet Address":
      return "/account";
    case "Transaction Hash":
      return "/tx";
    default:
      return null;
  }
};

const ResultItem = ({ type, value, handleSelectResult }: ResultItemProps) => {
  // TODO: should be removed once all types are supported
  // eslint-disable-next-line no-nested-ternary
  const text = type ? (getRoute(type) ? type : NOT_SUPPORTED) : NOT_FOUND;
  const route = type ? getRoute(type) : null;

  return (
    <ListItem p={2} borderBottomColor="pebble.700" bg="pebble.900">
      <Text variant="body2" fontWeight="500" color="text.dark" p="8px">
        {text}
      </Text>
      {route && (
        <Text
          variant="body2"
          p="8px"
          borderRadius="8px"
          _hover={{ bg: "pebble.800", cursor: "pointer" }}
          transition="all 0.25s ease-in-out"
          onClick={() => handleSelectResult(type, true)}
        >
          {value}
        </Text>
      )}
    </ListItem>
  );
};

const Searchbar = () => {
  const navigate = useInternalNavigate();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();

  const [keyword, setKeyword] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [results, setResults] = useState<SearchResultType[]>([]);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const res: SearchResultType[] = [];
    if (isCodeId(keyword)) res.push("Code ID");
    if (!validateContractAddress(keyword)) res.push("Contract Address");
    if (!validateUserAddress(keyword)) res.push("Wallet Address");
    if (isTxHash(keyword)) res.push("Transaction Hash");
    // TODO: add proposal ID
    setResults(res);
  }, [keyword, validateContractAddress, validateUserAddress]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setDisplayResults(inputValue.length > 0);
  };

  const handleSelectResult = (type?: SearchResultType, isClick = false) => {
    AmpTrackUseMainSearch(isClick);
    const route = type ? getRoute(type) : null;
    if (route) navigate({ pathname: `${route}/${keyword}` });
  };

  const handleOnKeyEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSelectResult(results.at(0));
  };

  useOutsideClick({
    ref: boxRef,
    handler: () => setDisplayResults(false),
  });

  return (
    <FormControl ref={boxRef}>
      <InputGroup>
        <Input
          value={keyword}
          h="36px"
          onChange={handleSearchChange}
          placeholder="Search by Wallet Address / Contract Address / Code ID / Tx Hash"
          focusBorderColor="lilac.main"
          onFocus={() => setDisplayResults(keyword.length > 0)}
          onKeyDown={handleOnKeyEnter}
        />
        <InputRightElement pointerEvents="none" h="full">
          <Icon as={MdSearch} w={5} h={5} color="pebble.600" />
        </InputRightElement>
      </InputGroup>
      {displayResults && (
        <List
          borderRadius="8px"
          bg="pebble.900"
          position="absolute"
          zIndex="2"
          w="full"
          top="50px"
          maxH="195px"
          overflowY="scroll"
          shadow="dark-lg"
        >
          {!results.length ? (
            <ResultItem
              key="Not Found"
              value={keyword}
              handleSelectResult={handleSelectResult}
            />
          ) : (
            results.map((type) => (
              <ResultItem
                key={type}
                type={type}
                value={keyword}
                handleSelectResult={handleSelectResult}
              />
            ))
          )}
        </List>
      )}
    </FormControl>
  );
};

export default Searchbar;
