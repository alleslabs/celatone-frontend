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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { AmpEvent } from "lib/amplitude";
import { useIsMac, useMobile } from "lib/app-provider";

import { NetworkButton } from "./NetworkButton";
import { NetworkMenuBody } from "./NetworkMenuBody";

export const NetworkMenu = observer(() => {
  const isMobile = useMobile();
  const isMac = useIsMac();
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
    <>
      <NetworkButton
        isMobile={isMobile}
        onClick={() => {
          track(AmpEvent.USE_SELECT_NETWORK);
          onOpen();
        }}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent h="100%" background="background.main">
          <DrawerHeader>
            <Flex alignItems="center" gap={2}>
              <Heading as="h6" variant="h6">
                Select Network
              </Heading>
              {!isMobile && (
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
              )}
            </Flex>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody overflow="scroll" px={4} pb={6}>
            <NetworkMenuBody onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});
