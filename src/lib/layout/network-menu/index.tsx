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

import { AmpEvent } from "lib/amplitude";
import { useMobile } from "lib/app-provider";

import { useNetworkSelector, useNetworkShortCut } from "./hooks";
import { NetworkButton } from "./NetworkButton";
import { NetworkMenuBody } from "./NetworkMenuBody";
import { NetworkMenuTop } from "./NetworkMenuTop";

export const NetworkMenu = observer(() => {
  const isMobile = useMobile();
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();

  const {
    keyword,
    setKeyword,
    handleOnKeyDown,
    cursor,
    setCursor,
    filteredPinnedChains,
    filteredMainnetChains,
    filteredTestnetChains,
  } = useNetworkSelector(onClose);

  useNetworkShortCut(onToggle);

  return (
    <>
      <NetworkButton
        isMobile={isMobile}
        onClick={() => {
          track(AmpEvent.USE_SELECT_NETWORK);
          onOpen();
        }}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        autoFocus={false}
      >
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
              handleOnKeyDown={handleOnKeyDown}
              onClose={onClose}
            />
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={4} pt={0} pb={6}>
            <NetworkMenuBody
              cursor={cursor}
              setCursor={setCursor}
              filteredPinnedChains={filteredPinnedChains}
              filteredMainnetChains={filteredMainnetChains}
              filteredTestnetChains={filteredTestnetChains}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});
