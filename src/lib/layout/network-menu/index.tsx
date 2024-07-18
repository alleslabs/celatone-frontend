import { track } from "@amplitude/analytics-browser";
import {
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
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { AmpEvent } from "lib/amplitude";
import { useCelatoneApp, useIsMac, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

import { NetworkMenuBody } from "./NetworkMenuBody";

const NetworkButton = ({
  isMobile,
  currentChainId,
}: {
  isMobile: boolean;
  currentChainId: string;
}) => {
  const width = isMobile ? "220px" : "170px";
  return (
    <MenuButton
      px={4}
      py={2}
      h="full"
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      w={width}
      borderRadius={isMobile ? "8px" : 0}
      borderWidth={isMobile ? "1px" : 0}
      borderColor={isMobile ? "gray.700" : "transparent"}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        display="flex"
        ml={1}
      >
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
  );
};

export const NetworkMenu = observer(() => {
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { currentChainId } = useCelatoneApp();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    const openSearchHandler = (event: KeyboardEvent) => {
      const specialKey = isMac ? event.metaKey : event.ctrlKey;
      if (event.key === `/` && specialKey) {
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

  return (
    <Menu
      onOpen={() => {
        track(AmpEvent.USE_SELECT_NETWORK);
        onOpen();
      }}
      autoSelect={!isMobile}
    >
      <NetworkButton isMobile={isMobile} currentChainId={currentChainId} />
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
                    /
                  </Text>
                </Kbd>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody overflow="scroll" px={4} pb={6}>
            <Flex direction="column" gap={6}>
              <NetworkMenuBody
                currentChainId={currentChainId}
                onClose={onClose}
              />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Menu>
  );
});
