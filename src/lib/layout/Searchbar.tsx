import {
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  List,
  FormControl,
  Text,
  useOutsideClick,
  Spinner,
  chakra,
  Flex,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpTrackUseMainSearch } from "lib/services/amplitude";
import { useICNSNamesByAddress } from "lib/services/nameService";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { Addr, Option } from "lib/types";

const NOT_FOUND_MSG =
  "Matches not found. Please check your spelling or make sure you have selected the correct network.";

const StyledListItem = chakra(ListItem, {
  baseStyle: {
    p: 2,
    borderBottomColor: "gray.700",
    bg: "gray.900",
  },
});
interface ResultItemProps {
  index: number;
  type: SearchResultType;
  value: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}

const getRouteOptions = (
  type: Option<SearchResultType>
): { pathname: string; query: string } | null => {
  switch (type) {
    case "Wallet Address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: "accountAddress",
      };
    case "Transaction Hash":
      return { pathname: "/txs/[txHash]", query: "txHash" };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: "codeId" };
    case "Contract Address":
      return {
        pathname: "/contracts/[contractAddress]",
        query: "contractAddress",
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: "height" };
    default:
      return null;
  }
};

const ResultItem = ({
  index,
  type,
  value,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;
  const { data: icnsNames } = useICNSNamesByAddress(value as Addr);
  return (
    <StyledListItem id={`item-${index}`}>
      <Text variant="body2" fontWeight={500} color="text.dark" p={2}>
        {type}
      </Text>
      {route && (
        <Flex
          direction="column"
          p={2}
          borderRadius="8px"
          _hover={{ bg: "gray.800", cursor: "pointer" }}
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          bg={index === cursor ? "gray.800" : undefined}
          onMouseMove={() => index !== cursor && setCursor(index)}
          onClick={() => handleSelectResult(type, true)}
        >
          {metadata.icns.address || icnsNames ? (
            <>
              <Text variant="body2">{metadata.icns.address || value}</Text>
              <Text variant="body3" color="text.dark">
                {icnsNames ? icnsNames.primary_name : value}
              </Text>
            </>
          ) : (
            <Text variant="body2">{value}</Text>
          )}
        </Flex>
      )}
    </StyledListItem>
  );
};

const ResultRender = ({
  results,
  keyword,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
}: {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}) => (
  <>
    {!results.length ? (
      <StyledListItem>
        <Text variant="body2" fontWeight={500} color="text.dark" p="8px">
          {NOT_FOUND_MSG}
        </Text>
      </StyledListItem>
    ) : (
      results.map((type, index) => (
        <ResultItem
          index={index}
          key={type}
          type={type}
          value={keyword}
          cursor={cursor}
          metadata={metadata}
          setCursor={setCursor}
          handleSelectResult={handleSelectResult}
        />
      ))
    )}
  </>
);

const getNextCursor = (
  key: string,
  current: Option<number>,
  lastIndex: number
) => {
  switch (key) {
    case "ArrowUp":
      if (current === undefined) return lastIndex;
      return current <= 0 ? lastIndex : current - 1;
    case "ArrowDown":
      if (current === undefined) return 0;
      return current >= lastIndex ? 0 : current + 1;
    default:
      return undefined;
  }
};

const getPlaceholder = (isWasm: boolean) => {
  const wasmText = isWasm ? "/ Code ID / Contract Address" : "";

  return `Search by Wallet Address / Tx Hash / Block ${wasmText}`;
};

const Searchbar = () => {
  const [keyword, setKeyword] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const {
    chainConfig: {
      features: {
        wasm: { enabled: isWasm },
      },
    },
  } = useCelatoneApp();
  const navigate = useInternalNavigate();
  const { results, isLoading, metadata } = useSearchHandler(keyword, () =>
    setIsTyping(false)
  );
  const boxRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setDisplayResults(inputValue.length > 0);
    setIsTyping(true);
    setCursor(0);
  };

  const handleSelectResult = useCallback(
    (type?: SearchResultType, isClick = false) => {
      AmpTrackUseMainSearch(isClick);
      const routeOptions = getRouteOptions(type);
      if (routeOptions) {
        navigate({
          pathname: routeOptions.pathname,
          query: { [routeOptions.query]: metadata.icns.address || keyword },
        });
        setDisplayResults(false);
        setKeyword("");
      }
    },
    [metadata.icns.address, keyword, navigate]
  );

  const handleOnKeyEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          const lastIndex = results.length - 1;
          const nextCursor = getNextCursor(e.key, cursor, lastIndex);
          const listItem = document.getElementById(`item-${nextCursor}`);
          e.preventDefault();
          setCursor(nextCursor);
          listItem?.scrollIntoView({ block: "nearest", inline: "center" });
          break;
        }
        case "Enter":
          handleSelectResult(results.at(cursor ?? 0));
          break;
        default:
          break;
      }
    },
    [cursor, results, handleSelectResult]
  );

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
          placeholder={getPlaceholder(isWasm)}
          focusBorderColor="secondary.main"
          onFocus={() => setDisplayResults(keyword.length > 0)}
          onKeyDown={handleOnKeyEnter}
          autoComplete="off"
        />
        <InputRightElement pointerEvents="none" h="full">
          <CustomIcon name="search" color="gray.600" />
        </InputRightElement>
      </InputGroup>
      {displayResults && (
        <List
          borderRadius="8px"
          bg="gray.900"
          position="absolute"
          zIndex={2}
          w="full"
          top="50px"
          maxH="195px"
          overflowY="scroll"
          shadow="dark-lg"
        >
          {isLoading || isTyping ? (
            <StyledListItem display="flex" alignItems="center" gap={2} p={4}>
              <Spinner color="gray.600" size="sm" />
              <Text color="text.disabled" variant="body2" fontWeight={500}>
                Looking for results ...
              </Text>
            </StyledListItem>
          ) : (
            <ResultRender
              results={results}
              keyword={keyword}
              cursor={cursor}
              metadata={metadata}
              setCursor={setCursor}
              handleSelectResult={handleSelectResult}
            />
          )}
        </List>
      )}
    </FormControl>
  );
};

export default Searchbar;
