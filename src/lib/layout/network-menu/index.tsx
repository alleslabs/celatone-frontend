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
import { AmpEvent } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { observer } from "mobx-react-lite";

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
    filteredDevnetChains,
    filteredLocalChains,
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
        autoFocus={false}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent
          background="background.main"
          gap={6}
          h="100%"
          minW="343px"
        >
          <DrawerHeader pb={0} pt={6} px={4}>
            <NetworkMenuTop
              handleOnKeyDown={handleOnKeyDown}
              keyword={keyword}
              setKeyword={setKeyword}
              onClose={onClose}
            />
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody pb={6} pt={0} px={4}>
            <NetworkMenuBody
              cursor={cursor}
              filteredDevnetChains={filteredDevnetChains}
              filteredLocalChains={filteredLocalChains}
              filteredMainnetChains={filteredMainnetChains}
              filteredPinnedChains={filteredPinnedChains}
              filteredTestnetChains={filteredTestnetChains}
              setCursor={setCursor}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});
