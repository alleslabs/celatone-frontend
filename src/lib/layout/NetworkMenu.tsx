import { track } from "@amplitude/analytics-browser";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Kbd,
  Menu,
  MenuButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { AmpEvent } from "lib/amplitude";
import { useCelatoneApp, useIsMac, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";

import { NetworkCard } from "./NetworkCard";

export const NetworkMenu = () => {
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { currentChainId, availableChainIds } = useCelatoneApp();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [keyword, setKeyword] = useState("");

  const width = isMobile ? "220px" : "170px";

  useEffect(() => {
    const openSearchHandler = (event: KeyboardEvent) => {
      const specialKey = isMac ? event.metaKey : event.ctrlKey;
      if (event.key === "l" && specialKey) {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    };
    document.addEventListener("keydown", openSearchHandler);
    return () => {
      document.removeEventListener("keydown", openSearchHandler);
    };
  }, [isMac, isOpen, onClose, onOpen]);

  const testnetChains = availableChainIds.filter(
    (chain) => CHAIN_CONFIGS[chain]?.networkType === "testnet"
  );

  const filteredTestnetChains = useMemo(() => {
    if (!keyword) return testnetChains;
    return testnetChains.filter(
      (chain) =>
        CHAIN_CONFIGS[chain]?.prettyName
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        chain.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, testnetChains]);

  const mainnetChain = availableChainIds.filter(
    (chain) => CHAIN_CONFIGS[chain]?.networkType === "mainnet"
  );

  const filteredMainnetChains = useMemo(() => {
    if (!keyword) return mainnetChain;
    return mainnetChain.filter(
      (chain) =>
        CHAIN_CONFIGS[chain]?.prettyName
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        chain.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, mainnetChain]);

  return (
    <Menu
      onOpen={() => {
        track(AmpEvent.USE_SELECT_NETWORK);
        onOpen();
      }}
      autoSelect={!isMobile}
    >
      <MenuButton
        pl={4}
        pr={2}
        py={1}
        borderRadius="8px"
        borderWidth="1px"
        borderColor="gray.600"
        _hover={{ bg: "gray.700" }}
        transition="all 0.25s ease-in-out"
        w={width}
      >
        <Flex alignItems="center" justifyContent="space-between" display="flex">
          <Text
            textOverflow="ellipsis"
            variant="body2"
            overflow="hidden"
            whiteSpace="nowrap"
            maxW={width}
          >
            {currentChainId}
          </Text>
          <CustomIcon name="chevron-down" color="gray.600" />
        </Flex>
      </MenuButton>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent h="100%" background="background.main">
          <DrawerHeader>
            <Flex alignItems="center" gap={2}>
              <Heading as="h6" variant="h6">
                Select Network
              </Heading>
              <Flex gap={1}>
                <Kbd size="sm">
                  <Text variant="body3" gap={1}>
                    {isMac ? "⌘" : "Ctrl"}
                  </Text>
                </Kbd>
                <Kbd>
                  <Text variant="body3" gap={1}>
                    l
                  </Text>
                </Kbd>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody overflow="scroll" px={4} pb={6}>
            <Flex direction="column" gap={6}>
              <InputWithIcon
                placeholder="Search by Name or Chain ID"
                size="md"
                value={keyword}
                autoFocus
                onChange={(e) => setKeyword(e.target.value)}
                amptrackSection="network-search"
              />
              <Accordion
                variant="transparent"
                allowMultiple
                defaultIndex={Array.from(
                  Array(availableChainIds.length).keys()
                )}
                width="full"
                p={0}
              >
                <AccordionItem>
                  <AccordionButton p={0}>
                    <Flex mb={4} justifyContent="space-between" w="full">
                      <Heading as="h6" variant="h6">
                        Mainnet
                      </Heading>
                      <AccordionIcon color="gray.600" />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel p={0}>
                    {filteredMainnetChains.length ? (
                      <Flex direction="column" gap={2}>
                        {filteredMainnetChains.map((chainId) => (
                          <NetworkCard
                            key={chainId}
                            image={CHAIN_CONFIGS[chainId]?.logoUrl}
                            chainId={chainId}
                            isSelected={chainId === currentChainId}
                          />
                        ))}
                      </Flex>
                    ) : (
                      <EmptyState
                        my={0}
                        imageVariant="empty"
                        imageWidth={40}
                        textVariant="body2"
                        message="No matched result found.
                Please check your keyword."
                      />
                    )}
                  </AccordionPanel>
                </AccordionItem>
                <Divider borderColor="gray.700" pt={2} />
                <AccordionItem mt={4}>
                  <AccordionButton p={0}>
                    <Flex mb={4} justifyContent="space-between" w="full">
                      <Heading as="h6" variant="h6">
                        Testnet
                      </Heading>
                      <AccordionIcon color="gray.600" />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel p={0}>
                    {filteredTestnetChains.length ? (
                      <Flex direction="column" gap={2}>
                        {filteredTestnetChains.map((chainId) => (
                          <NetworkCard
                            key={chainId}
                            image={CHAIN_CONFIGS[chainId]?.logoUrl}
                            chainId={chainId}
                            isSelected={chainId === currentChainId}
                          />
                        ))}
                      </Flex>
                    ) : (
                      <EmptyState
                        my={0}
                        imageVariant="empty"
                        imageWidth={40}
                        textVariant="body2"
                        message="No matched result found.
                Please check your keyword."
                      />
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Menu>
  );
};
