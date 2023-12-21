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
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { CURR_THEME } from "env";
import { trackUseMainSearch } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { MoveAccountAddr, Nullable, Option } from "lib/types";
import { splitModule } from "lib/utils";

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
  onClose?: () => void;
}

const generateQueryObject = (params: string[], value: string | string[]) =>
  typeof value === "string"
    ? { [params[0]]: value }
    : params.reduce((acc, curr, idx) => ({ ...acc, [curr]: value[idx] }), {});

const getRouteOptions = (
  type: Option<SearchResultType>
): Nullable<{ pathname: string; query: string[] }> => {
  switch (type) {
    case "Account Address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: ["accountAddress"],
      };
    case "Transaction Hash":
      return { pathname: "/txs/[txHash]", query: ["txHash"] };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: ["codeId"] };
    case "Contract Address":
      return {
        pathname: "/contracts/[contractAddress]",
        query: ["contractAddress"],
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: ["height"] };
    case "Pool ID":
      return { pathname: "/pools/[poolId]", query: ["poolId"] };
    case "Module Path":
      return {
        pathname: "/modules/[address]/[moduleName]",
        query: ["address", "moduleName"],
      };
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
  onClose,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;
  const normalizedIcnsValue = value.endsWith(`.${metadata.icns.bech32Prefix}`)
    ? value
    : `${value}.${metadata.icns.bech32Prefix}`;
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
          onClick={() => {
            handleSelectResult(type, true);
            onClose?.();
          }}
        >
          <Text variant="body2">{metadata.icns.address || value}</Text>
          {metadata.icns.icnsNames?.primary_name && (
            <Flex gap={1} align="center" flexWrap="wrap">
              <Flex gap={1} align="center">
                <PrimaryNameMark />
                <Text variant="body3" color="text.dark">
                  {metadata.icns.icnsNames.primary_name}
                </Text>
              </Flex>
              {value !== metadata.icns.address &&
                normalizedIcnsValue !==
                  metadata.icns.icnsNames?.primary_name && (
                  <Text
                    variant="body3"
                    color="text.dark"
                    _before={{
                      content: '"/"',
                      fontSize: "12px",
                      color: "text.dark",
                      mr: 1,
                    }}
                  >
                    {normalizedIcnsValue}
                  </Text>
                )}
            </Flex>
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
  onClose,
}: {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
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
          onClose={onClose}
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

const getPlaceholder = ({
  isWasm,
  isPool,
  isMove,
}: {
  isWasm: boolean;
  isPool: boolean;
  isMove: boolean;
}) => {
  const wasmText = isWasm ? "/ Code ID / Contract Address " : "";
  const poolText = isPool ? "/ Pool ID " : "";
  const moveText = isMove ? "/ Module Path " : "";

  return `Search by Account Address / Tx Hash / Block${wasmText}${poolText}${moveText}`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const Searchbar = () => {
  const [keyword, setKeyword] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const {
    chainConfig: {
      features: {
        wasm: { enabled: isWasm },
        pool: { enabled: isPool },
        move: { enabled: isMove },
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
      trackUseMainSearch(isClick, type);
      const routeOptions = getRouteOptions(type);
      if (routeOptions) {
        const queryValues =
          type === "Module Path"
            ? (splitModule(keyword) as [MoveAccountAddr, string])
            : metadata.icns.address || keyword;
        navigate({
          pathname: routeOptions.pathname,
          query: generateQueryObject(routeOptions.query, queryValues),
        });
        setDisplayResults(false);
        setKeyword("");
      }
    },
    [navigate, metadata.icns.address, keyword]
  );

  const handleOnKeyEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, onClose?: () => void) => {
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
          handleSelectResult(results[cursor ?? 0]);
          onClose?.();
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
  const isMobile = useMobile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return isMobile ? (
    <>
      <Button variant="outline-gray" size="sm" onClick={onOpen}>
        <CustomIcon name="search" boxSize={3} />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody overflowY="scroll" p={2} m={2}>
            <FormControl ref={boxRef}>
              <InputGroup mb={4} alignItems="center">
                <IconButton
                  fontSize="24px"
                  variant="gray"
                  aria-label="back"
                  onClick={() => onClose()}
                  color="gray.600"
                  icon={<CustomIcon name="chevron-left" />}
                />
                <Input
                  value={keyword}
                  h="36px"
                  onChange={handleSearchChange}
                  placeholder="Type your keyword ..."
                  focusBorderColor="secondary.main"
                  autoFocus
                  onFocus={() => setDisplayResults(keyword.length > 0)}
                  onKeyDown={(e) => handleOnKeyEnter(e, onClose)}
                  autoComplete="off"
                />
                <InputRightElement pointerEvents="none" h="full">
                  <CustomIcon name="search" color="gray.600" />
                </InputRightElement>
              </InputGroup>
              {displayResults ? (
                <List borderRadius="8px" bg="gray.900" w="full">
                  {isLoading || isTyping ? (
                    <StyledListItem
                      display="flex"
                      alignItems="center"
                      gap={2}
                      p={4}
                    >
                      <Spinner color="gray.600" size="sm" />
                      <Text
                        color="text.disabled"
                        variant="body2"
                        fontWeight={500}
                      >
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
                      onClose={onClose}
                      metadata={metadata}
                    />
                  )}
                </List>
              ) : (
                <Flex
                  bg="background.main"
                  p={5}
                  justify="center"
                  borderRadius={CURR_THEME.borderRadius.default}
                >
                  <Text variant="body2" color="text.dark">
                    Your result will display here
                  </Text>
                </Flex>
              )}
            </FormControl>
            <Text variant="body3" color="text.dark" textAlign="center" mt={2}>
              {getPlaceholder({ isWasm, isPool, isMove })}
            </Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <FormControl ref={boxRef} zIndex={3}>
      <InputGroup>
        <Input
          value={keyword}
          h="36px"
          onChange={handleSearchChange}
          placeholder={getPlaceholder({ isWasm, isPool, isMove })}
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
