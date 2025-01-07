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
    cursor,
    filteredDevnetChains,
    filteredLocalChains,
    filteredMainnetChains,
    filteredPinnedChains,
    filteredTestnetChains,
    handleOnKeyDown,
    keyword,
    setCursor,
    setKeyword,
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
        placement="right"
        autoFocus={false}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent
          gap={6}
          h="100%"
          minW="343px"
          background="background.main"
        >
          <DrawerHeader pb={0} pt={6} px={4}>
            <NetworkMenuTop
              keyword={keyword}
              handleOnKeyDown={handleOnKeyDown}
              onClose={onClose}
              setKeyword={setKeyword}
            />
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody pb={6} pt={0} px={4}>
            <NetworkMenuBody
              filteredDevnetChains={filteredDevnetChains}
              filteredMainnetChains={filteredMainnetChains}
              filteredPinnedChains={filteredPinnedChains}
              filteredTestnetChains={filteredTestnetChains}
              cursor={cursor}
              filteredLocalChains={filteredLocalChains}
              onClose={onClose}
              setCursor={setCursor}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});
