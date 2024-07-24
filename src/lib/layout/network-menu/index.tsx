import { track } from "@amplitude/analytics-browser";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { AmpEvent } from "lib/amplitude";
import { useIsMac, useMobile } from "lib/app-provider";

import { useNetworkSelector } from "./hooks/useNetworkSelector";
import { NetworkButton } from "./NetworkButton";
import { NetworkMenuBody } from "./NetworkMenuBody";
import { NetworkMenuTop } from "./NetworkMenuTop";

export const NetworkMenu = observer(() => {
  const isMobile = useMobile();
  const isMac = useIsMac();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    keyword,
    setKeyword,
    handleOnKeyEnter,
    setNetworks,
    cursor,
    setCursor,
  } = useNetworkSelector(onClose);

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

    return () => document.removeEventListener("keydown", openSearchHandler);
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
        <DrawerContent
          h="100%"
          background="background.main"
          minW="343px"
          gap={6}
        >
          <DrawerHeader px={4} pt={6} pb={0}>
            <NetworkMenuTop
              keyword={keyword}
              setKeyword={setKeyword}
              handleOnKeyEnter={handleOnKeyEnter}
            />
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={4} pt={0} pb={6}>
            <NetworkMenuBody
              keyword={keyword}
              setNetworks={setNetworks}
              cursor={cursor}
              setCursor={setCursor}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});
