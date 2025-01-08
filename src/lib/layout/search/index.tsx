import {
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
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
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
    ref: boxRef,
  });

  useEaster(keyword);

  return (
    <>
      {isMobile ? (
        <Button
          minH="60px"
          minW="60px"
          size="sm"
          variant="ghost-gray"
          borderRadius={0}
          onClick={onOpen}
        >
          <CustomIcon name="search" boxSize={3} />
        </Button>
      ) : (
        <Flex
          alignItems="center"
          h="full"
          p={4}
          w="full"
          _hover={{
            background: "gray.800",
          }}
          cursor="pointer"
          justifyContent="space-between"
          onClick={onOpen}
          transition="all 0.25s ease-in-out"
        >
          <Flex gap={1}>
            <CustomIcon name="search" boxSize={4} color="gray.600" />
            <Text variant="body1" color="text.disabled">
              Search on {currentChainId}
            </Text>
          </Flex>
          <Flex pb={1} borderRadius={4}>
            <span>
              <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> <Kbd>K</Kbd>
            </span>
          </Flex>
        </Flex>
      )}
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onCloseWithClear}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          h={{ base: "100%", md: "auto" }}
          maxW="100vw"
          w={{ base: "100%", md: "800px" }}
        >
          <ModalHeader
            p={0}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
            position="relative"
          >
            <FormControl zIndex={3} ref={boxRef}>
              <Flex alignItems="center">
                {isMobile && (
                  <Flex
                    ml={3}
                    p={1}
                    bgColor="gray.700"
                    borderRadius={8}
                    cursor="pointer"
                    onClick={onCloseWithClear}
                  >
                    <CustomIcon
                      name="chevron-left"
                      boxSize={4}
                      color="text.dark"
                    />
                  </Flex>
                )}
                <InputWithIcon
                  style={{ border: "none", maxHeight: "54px" }}
                  minW="200px"
                  pl={10}
                  pr={40}
                  size="lg"
                  value={keyword}
                  w="100%"
                  autoComplete="off"
                  onChange={handleSearchChange}
                  onKeyDown={handleOnKeyDown}
                  placeholder="Enter your keyword..."
                />
              </Flex>
            </FormControl>
            <Tag
              right={4}
              size="sm"
              variant="primary-light"
              position="absolute"
            >
              {currentChainId}
            </Tag>
          </ModalHeader>
          <ModalBody
            alignItems="center"
            minH={{ base: "80vh", md: "460px" }}
            px={3}
            justifyContent="center"
          >
            {keyword.length > 0 ? (
              <>
                {isLoading || isTyping ? (
                  <Flex
                    alignItems="center"
                    gap={3}
                    minH="360px"
                    py={5}
                    direction="column"
                    justifyContent="center"
                  >
                    <Spinner size="sm" color="gray.600" />
                    <Text
                      variant="body2"
                      color="text.disabled"
                      fontWeight={500}
                    >
                      Looking for results ...
                    </Text>
                  </Flex>
                ) : (
                  <List>
                    {results.length > 0 && (
                      <Text mb={3} variant="body2" color="text.dark">
                        {results.length} Matched{" "}
                        {plur("result", results.length)}...
                      </Text>
                    )}
                    <SearchResults
                      handleSelectResult={handleSelectResult}
                      results={results}
                      cursor={cursor}
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
                  isNft={isNft}
                  isWasm={isWasm}
                  isGov={isGov}
                  isMove={isMove}
                  isPool={isPool}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
