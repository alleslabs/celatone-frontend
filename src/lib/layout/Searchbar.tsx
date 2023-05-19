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
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpTrackUseMainSearch } from "lib/services/amplitude";
import type { SearchResultType } from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { Option } from "lib/types";

const NOT_FOUND =
  "Matches not found. Please check your spelling or make sure you have selected the correct network.";

const StyledListItem = chakra(ListItem, {
  baseStyle: {
    p: 2,
    borderBottomColor: "pebble.700",
    bg: "pebble.900",
  },
});
interface ResultItemProps {
  index: number;
  type: SearchResultType;
  value: string;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}

/**
 * @todos Change path to plural form
 */
const getRouteOptions = (
  type: Option<SearchResultType>
): { pathname: string; query: string } | null => {
  switch (type) {
    case "Wallet Address":
      return { pathname: "/account/[accountAddress]", query: "accountAddress" };
    case "Transaction Hash":
      return { pathname: "/tx/[txHash]", query: "txHash" };
    case "Code ID":
      return { pathname: "/code/[codeId]", query: "codeId" };
    case "Contract Address":
      return {
        pathname: "/contract/[contractAddress]",
        query: "contractAddress",
      };
    case "Block":
      return { pathname: "/block/[height]", query: "height" };
    default:
      return null;
  }
};

const ResultItem = ({
  index,
  type,
  value,
  cursor,
  setCursor,
  handleSelectResult,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;

  return (
    <StyledListItem id={`item-${index}`}>
      <Text variant="body2" fontWeight={500} color="text.dark" p="8px">
        {type}
      </Text>
      {route && (
        <Text
          variant="body2"
          p="8px"
          borderRadius="8px"
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          bg={index === cursor ? "pebble.800" : undefined}
          onMouseMove={() => index !== cursor && setCursor(index)}
          onClick={() => handleSelectResult(type, true)}
        >
          {value}
        </Text>
      )}
    </StyledListItem>
  );
};

const ResultRender = ({
  results,
  keyword,
  cursor,
  setCursor,
  handleSelectResult,
}: {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}) => (
  <>
    {!results.length ? (
      <StyledListItem>
        <Text variant="body2" fontWeight={500} color="text.dark" p="8px">
          {NOT_FOUND}
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

const Searchbar = () => {
  const [keyword, setKeyword] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const navigate = useInternalNavigate();
  const resetHandlerStates = useCallback(() => {
    setIsTyping(false);
    setCursor(undefined);
  }, []);
  const { results, isLoading } = useSearchHandler(keyword, resetHandlerStates);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setDisplayResults(inputValue.length > 0);
    setIsTyping(true);
  };

  const handleSelectResult = useCallback(
    (type?: SearchResultType, isClick = false) => {
      AmpTrackUseMainSearch(isClick);
      const routeOptions = getRouteOptions(type);
      if (routeOptions) {
        navigate({
          pathname: routeOptions.pathname,
          query: { [routeOptions.query]: keyword },
        });
        setDisplayResults(false);
        setKeyword("");
      }
    },
    [keyword, navigate]
  );

  const handleOnKeyEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;
      const lastIndex = results.length - 1;
      const nextCursor = getNextCursor(e.key, cursor, lastIndex);
      const listItem = document.getElementById(`item-${nextCursor}`);
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();
          setCursor(nextCursor);
          listItem?.scrollIntoView({ block: "nearest", inline: "center" });
          break;
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
          placeholder="Search by Wallet Address / Tx Hash / Code ID / Contract Address / Block"
          focusBorderColor="lilac.main"
          onFocus={() => setDisplayResults(keyword.length > 0)}
          onKeyDown={handleOnKeyEnter}
          autoComplete="off"
        />
        <InputRightElement pointerEvents="none" h="full">
          <CustomIcon name="search" />
        </InputRightElement>
      </InputGroup>
      {displayResults && (
        <List
          borderRadius="8px"
          bg="pebble.900"
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
              <Spinner color="pebble.600" size="sm" />
              <Text color="text.disabled" variant="body2" fontWeight={500}>
                Looking for results ...
              </Text>
            </StyledListItem>
          ) : (
            <ResultRender
              cursor={cursor}
              setCursor={setCursor}
              results={results}
              keyword={keyword}
              handleSelectResult={handleSelectResult}
            />
          )}
        </List>
      )}
    </FormControl>
  );
};

export default Searchbar;
