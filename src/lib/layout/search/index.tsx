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
import plur from "plur";
import type {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";

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
import type { SearchResult } from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { Addr } from "lib/types";
import { splitModulePath } from "lib/utils";

import { SearchResults } from "./SearchResults";
import { SearchZeroState } from "./SearchZeroState";
import { generateQueryObject, getNextCursor, getRouteOptions } from "./utils";

export const SearchComponent = () => {
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { isFullTier } = useTierConfig();
  const navigate = useInternalNavigate();
  const {
    currentChainId,
    chainConfig: {
      features: {
        gov: { enabled: isGov },
        wasm: { enabled: isWasm },
        move: { enabled: isMove },
        evm: { enabled: isEvm },
        pool: { enabled: isPool },
        nft: { enabled: isNft },
      },
    },
  } = useCelatoneApp();

  const boxRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const { results, isLoading } = useSearchHandler(keyword, () =>
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
        if (result?.type === "Module Path")
          return splitModulePath(result.value) as [Addr, string];
        if (result?.type === "NFT Address")
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
    ref: boxRef as RefObject<HTMLDivElement>,
    handler: onCloseWithClear,
  });

  useEaster(keyword);

  return (
    <>
      {isMobile ? (
        <Button
          variant="ghost-gray"
          size="sm"
          onClick={onOpen}
          minW="60px"
          minH="60px"
          borderRadius={0}
        >
          <CustomIcon name="search" boxSize={3} />
        </Button>
      ) : (
        <Flex
          onClick={onOpen}
          w="full"
          h="full"
          p={4}
          alignItems="center"
          justifyContent="space-between"
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          _hover={{
            background: "gray.800",
          }}
        >
          <Flex gap={1} alignItems="center">
            <CustomIcon color="gray.600" name="search" boxSize={4} />
            <Text variant="body2" color="text.disabled">
              Search on {currentChainId}
            </Text>
          </Flex>
          <Box>
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> <Kbd>K</Kbd>
          </Box>
        </Flex>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onCloseWithClear}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          w={{ base: "100%", md: "800px" }}
          h={{ base: "100%", md: "auto" }}
          bg="gray.800"
          maxW="100vw"
        >
          <ModalHeader
            position="relative"
            p={0}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
          >
            <FormControl ref={boxRef} zIndex={3}>
              <Flex alignItems="center">
                {isMobile && (
                  <Flex
                    p={1}
                    borderRadius={8}
                    bgColor="gray.700"
                    ml={3}
                    onClick={onCloseWithClear}
                    cursor="pointer"
                  >
                    <CustomIcon
                      name="chevron-left"
                      color="text.dark"
                      boxSize={4}
                    />
                  </Flex>
                )}
                <InputWithIcon
                  w="100%"
                  minW="200px"
                  size="lg"
                  placeholder="Enter your keyword..."
                  style={{ maxHeight: "54px", border: "none" }}
                  pr={40}
                  pl={10}
                  value={keyword}
                  onChange={handleSearchChange}
                  onKeyDown={handleOnKeyDown}
                  autoComplete="off"
                />
              </Flex>
            </FormControl>
            <Tag
              variant="primary-light"
              size="sm"
              position="absolute"
              right={4}
            >
              {currentChainId}
            </Tag>
          </ModalHeader>
          <ModalBody
            px={3}
            minH={{ base: "80vh", md: "460px" }}
            justifyContent="center"
            alignItems="center"
          >
            {keyword.length > 0 ? (
              <>
                {isLoading || isTyping ? (
                  <Flex
                    py={5}
                    gap={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    minH="360px"
                  >
                    <Spinner color="gray.600" size="sm" />
                    <Text
                      color="text.disabled"
                      variant="body2"
                      fontWeight={500}
                    >
                      Looking for results ...
                    </Text>
                  </Flex>
                ) : (
                  <List>
                    {results.length > 0 && (
                      <Text variant="body2" color="text.dark" mb={3}>
                        {results.length} Matched{" "}
                        {plur("result", results.length)}...
                      </Text>
                    )}
                    <SearchResults
                      results={results}
                      cursor={cursor}
                      setCursor={setCursor}
                      handleSelectResult={handleSelectResult}
                    />
                  </List>
                )}
              </>
            ) : (
              <Flex justifyContent="center">
                <SearchZeroState
                  isPool={isPool}
                  isWasm={isWasm}
                  isMove={isMove}
                  isEvm={isEvm}
                  isGov={isGov}
                  isNft={isNft}
                  isFullTier={isFullTier}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
