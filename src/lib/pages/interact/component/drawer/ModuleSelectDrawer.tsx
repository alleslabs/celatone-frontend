import type { BechAddr, HexAddr, IndexedModule, Option } from "lib/types";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useConvertHexAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useModulesByAddress } from "lib/services/move/module";
import { isHexWalletAddress } from "lib/utils";
import { useEffect, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "./types";

import { ModuleEmptyState } from "../common";
import { DrawerBodyDesktop } from "./body";
import { ModuleSelector } from "./selector";

interface ModuleSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hexAddress: Option<HexAddr>;
  handleModuleSelect: ModuleSelectFunction;
}

export const ModuleSelectDrawer = ({
  isOpen,
  onClose,
  hexAddress,
  handleModuleSelect,
}: ModuleSelectDrawerProps) => {
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as BechAddr,
    hex: "" as HexAddr,
  });
  const [modules, setModules] = useState<IndexedModule[]>();

  const { refetch } = useModulesByAddress({
    address: selectedAddress.hex,
    enabled: false,
    onSuccess: ({ items }) => setModules(items),
  });

  useEffect(() => {
    if (hexAddress) {
      setMode("display");
      setSelectedAddress({
        address: isHexWalletAddress(hexAddress)
          ? convertHexWalletAddress(hexAddress)
          : convertHexModuleAddress(hexAddress),
        hex: hexAddress,
      });
    } else {
      setMode("input");
      setSelectedAddress({
        address: "" as BechAddr,
        hex: "" as HexAddr,
      });
      setModules(undefined);
    }
  }, [convertHexWalletAddress, convertHexModuleAddress, hexAddress]);

  useEffect(() => {
    if (isOpen && selectedAddress.hex) refetch();
  }, [isOpen, refetch, selectedAddress.hex]);

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent h="90%">
        <DrawerHeader
          borderBottomWidth="1px"
          borderColor="gray.700"
          borderStyle="solid"
        >
          <CustomIcon boxSize={6} color="gray.600" name="contract-address" />
          <Heading as="h5" variant="h5">
            Select Module
          </Heading>
        </DrawerHeader>
        <DrawerCloseButton color="text.dark" />
        <DrawerBody p={6}>
          <Flex direction="column" h="full">
            <ModuleSelector
              closeModal={onClose}
              handleModuleSelect={handleModuleSelect}
              mode={mode}
              selectedAddress={selectedAddress}
              setMode={setMode}
              setModules={setModules}
              setSelectedAddress={setSelectedAddress}
            />
            {modules ? (
              <DrawerBodyDesktop
                closeModal={onClose}
                handleModuleSelect={handleModuleSelect}
                mode={mode}
                modules={modules}
                selectedAddress={selectedAddress}
              />
            ) : (
              <ModuleEmptyState
                description="Available functions for selected modules will display here"
                hasImage
              />
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
