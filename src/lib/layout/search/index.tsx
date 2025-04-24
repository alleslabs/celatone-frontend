import type { SearchResult } from "lib/services/searchService";
import type { Addr } from "lib/types";
import type {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  Kbd,
  List,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { trackUseMainSearch } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useIsMac,
  useMobile,
  useTierConfig,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { useEaster } from "lib/hooks";
import { useSearchHandler } from "lib/services/searchService";
import { splitModulePath } from "lib/utils";
import plur from "plur";
import { useCallback, useEffect, useRef, useState } from "react";

import { SearchResults } from "./SearchResults";
import { SearchZeroState } from "./SearchZeroState";
import { generateQueryObject, getNextCursor, getRouteOptions } from "./utils";

export const SearchComponent = () => {
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { isFullTier } = useTierConfig();
  const navigate = useInternalNavigate();
  const {
    chainConfig: {
      features: {
        evm: { enabled: isEvm },
        gov: { enabled: isGov },
        move: { enabled: isMove },
        nft: { enabled: isNft },
        pool: { enabled: isPool },
        wasm: { enabled: isWasm },
      },
    },
    currentChainId,
  } = useCelatoneApp();

  const boxRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const onCloseWithClear = useCallback(() => {
    setKeyword("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const openSearchHandler = (event: KeyboardEvent) => {
      const specialKey = isMac ? event.metaKey : event.ctrlKey;
      if (event.key === "k" && specialKey) {
        event.preventDefault();
        if (isOpen) {
          onCloseWithClear();
        } else {
          onOpen();
        }
      }
    };
    document.addEventListener("keydown", openSearchHandler);
    return () => {
      document.removeEventListener("keydown", openSearchHandler);
    };
  }, [isMac, isOpen, onCloseWithClear, onOpen]);

  const { isLoading, results } = useSearchHandler(keyword, () =>
    setIsTyping(false)
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setIsTyping(true);
    setCursor(0);
  };

  const handleSelectResult = useCallback(
    (result?: SearchResult, isClick = false) => {
      const getQueryValue = () => {
        if (result?.type === "Module path")
          return splitModulePath(result.value) as [Addr, string];
        if (result?.type === "NFT address")
          return [result.metadata?.nft?.collectionAddress ?? "", result.value];
        return result?.value || keyword;
      };

      trackUseMainSearch(isClick, result?.type);
      const routeOptions = getRouteOptions(result?.type, isEvm);
      if (routeOptions) {
        const queryValues = getQueryValue();
        navigate({
          pathname: routeOptions.pathname,
          query: generateQueryObject(routeOptions.query, queryValues),
        });
        onCloseWithClear();
      }
    },
    [isEvm, keyword, navigate, onCloseWithClear]
  );

  const handleOnKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp": {
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
        case "Escape":
          if (keyword.length > 0) {
            e.preventDefault();
            setKeyword("");
          }
          break;
        default:
          break;
      }
    },
    [cursor, handleSelectResult, keyword.length, results]
  );

  useOutsideClick({
    handler: onCloseWithClear,
    ref: boxRef as RefObject<HTMLDivElement>,
  });

  useEaster(keyword);

  return (
    <>
      {isMobile ? (
        <Button
          borderRadius={0}
          minH="60px"
          minW="60px"
          size="sm"
          variant="ghost-gray"
          onClick={onOpen}
        >
          <CustomIcon boxSize={3} name="search" />
        </Button>
      ) : (
        <Flex
          _hover={{
            background: "gray.800",
          }}
          alignItems="center"
          cursor="pointer"
          h="full"
          justifyContent="space-between"
          p={4}
          transition="all 0.25s ease-in-out"
          w="full"
          onClick={onOpen}
        >
          <Flex alignItems="center" gap={1}>
            <CustomIcon boxSize={4} color="gray.600" name="search" />
            <Text color="text.disabled" variant="body2">
              Search on {currentChainId}
            </Text>
          </Flex>
          <Box>
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> <Kbd>K</Kbd>
          </Box>
        </Flex>
      )}
      <Modal
        isCentered
        isOpen={isOpen}
        returnFocusOnClose={false}
        onClose={onCloseWithClear}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          h={{ base: "100%", md: "auto" }}
          maxW="100vw"
          w={{ base: "100%", md: "800px" }}
        >
          <ModalHeader
            borderBottomColor="gray.700"
            borderBottomWidth="1px"
            p={0}
            position="relative"
          >
            <FormControl zIndex={3} ref={boxRef}>
              <Flex alignItems="center">
                {isMobile && (
                  <Flex
                    bgColor="gray.700"
                    borderRadius={8}
                    cursor="pointer"
                    ml={3}
                    p={1}
                    onClick={onCloseWithClear}
                  >
                    <CustomIcon
                      boxSize={4}
                      color="text.dark"
                      name="chevron-left"
                    />
                  </Flex>
                )}
                <InputWithIcon
                  style={{ border: "none", maxHeight: "54px" }}
                  autoComplete="off"
                  minW="200px"
                  pl={10}
                  placeholder="Enter your keyword..."
                  pr={40}
                  size="lg"
                  value={keyword}
                  w="100%"
                  onChange={handleSearchChange}
                  onKeyDown={handleOnKeyDown}
                />
              </Flex>
            </FormControl>
            <Tag
              position="absolute"
              right={4}
              size="sm"
              variant="primary-light"
            >
              {currentChainId}
            </Tag>
          </ModalHeader>
          <ModalBody
            alignItems="center"
            justifyContent="center"
            minH={{ base: "80vh", md: "460px" }}
            px={3}
          >
            {keyword.length > 0 ? (
              <>
                {isLoading || isTyping ? (
                  <Flex
                    alignItems="center"
                    direction="column"
                    gap={3}
                    justifyContent="center"
                    minH="360px"
                    py={5}
                  >
                    <Spinner color="gray.600" size="sm" />
                    <Text
                      color="text.disabled"
                      fontWeight={500}
                      variant="body2"
                    >
                      Looking for results ...
                    </Text>
                  </Flex>
                ) : (
                  <List>
                    {results.length > 0 && (
                      <Text color="text.dark" mb={3} variant="body2">
                        {results.length} Matched{" "}
                        {plur("result", results.length)}...
                      </Text>
                    )}
                    <SearchResults
                      cursor={cursor}
                      handleSelectResult={handleSelectResult}
                      results={results}
                      setCursor={setCursor}
                    />
                  </List>
                )}
              </>
            ) : (
              <Flex justifyContent="center">
                <SearchZeroState
                  isEvm={isEvm}
                  isFullTier={isFullTier}
                  isGov={isGov}
                  isMove={isMove}
                  isNft={isNft}
                  isPool={isPool}
                  isWasm={isWasm}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
