import {
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FormControl,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  useDisclosure,
  useOutsideClick,
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
import InputWithIcon from "lib/components/InputWithIcon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { Addr, Nullable, Option } from "lib/types";
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
    case "Proposal ID":
      return { pathname: "/proposals/[proposalId]", query: ["proposalId"] };
    case "Validator Address":
      return {
        pathname: "/validators/[validatorAddress]",
        query: ["validatorAddress"],
      };
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
          key={type}
          index={index}
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
  isGov,
}: {
  isWasm: boolean;
  isPool: boolean;
  isMove: boolean;
  isGov: boolean;
}) => {
  const govText = isGov ? " / Validator Address / Proposal ID" : "";
  const wasmText = isWasm ? " / Code ID / Contract Address" : "";
  const moveText = isMove ? " / Module Path" : "";
  const poolText = isPool ? " / Pool ID" : "";

  return `Search by Account Address / Tx Hash / Block${govText}${wasmText}${moveText}${poolText}`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const Searchbar = () => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const {
    currentChainId,
    chainConfig: {
      features: {
        gov: { enabled: isGov },
        wasm: { enabled: isWasm },
        move: { enabled: isMove },
        pool: { enabled: isPool },
      },
    },
  } = useCelatoneApp();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const boxRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const { results, isLoading, metadata } = useSearchHandler(keyword, () =>
    setIsTyping(false)
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
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
            ? (splitModule(keyword) as [Addr, string])
            : metadata.icns.address || keyword;
        navigate({
          pathname: routeOptions.pathname,
          query: generateQueryObject(routeOptions.query, queryValues),
        });
        setKeyword("");
        onClose();
      }
    },
    [keyword, metadata.icns.address, navigate, onClose]
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
          e.currentTarget.blur();
          handleSelectResult(results[cursor ?? 0]);
          break;
        default:
          break;
      }
    },
    [cursor, handleSelectResult, results]
  );

  useOutsideClick({
    ref: boxRef,
    handler: onClose,
  });

  return isMobile ? (
    <>
      <Button variant="outline-gray" size="sm" onClick={onOpen}>
        <CustomIcon name="search" boxSize={3} />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent ref={boxRef}>
          <DrawerBody overflowY="scroll" p={2} m={2}>
            <FormControl>
              <Flex mb={4}>
                <IconButton
                  fontSize="24px"
                  variant="gray"
                  aria-label="back"
                  onClick={onClose}
                  color="gray.600"
                  icon={<CustomIcon name="chevron-left" />}
                />
                <InputWithIcon
                  value={keyword}
                  onChange={handleSearchChange}
                  placeholder="Type your keyword ..."
                  autoFocus
                  onKeyDown={handleOnKeyEnter}
                  autoComplete="off"
                />
              </Flex>
              {keyword.length > 0 ? (
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
              {getPlaceholder({ isWasm, isPool, isMove, isGov })}
            </Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <FormControl ref={boxRef} zIndex={3}>
      <InputWithIcon
        value={keyword}
        onChange={handleSearchChange}
        placeholder={`Search on ${currentChainId}`}
        onFocus={onOpen}
        onKeyDown={handleOnKeyEnter}
        autoComplete="off"
      />
      {isOpen && (
        <List
          borderRadius="8px"
          bg="gray.900"
          position="absolute"
          w="full"
          top="50px"
          overflowY="scroll"
          shadow="dark-lg"
        >
          {keyword.length > 0 ? (
            <>
              {isLoading || isTyping ? (
                <StyledListItem
                  display="flex"
                  alignItems="center"
                  gap={2}
                  p={4}
                >
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
            </>
          ) : (
            <StyledListItem p={4}>
              <Text color="text.disabled" variant="body2" fontWeight={500}>
                {getPlaceholder({ isWasm, isPool, isMove, isGov })}
              </Text>
            </StyledListItem>
          )}
        </List>
      )}
    </FormControl>
  );
};

export default Searchbar;
