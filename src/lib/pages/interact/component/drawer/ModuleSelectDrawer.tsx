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
import { useEffect, useState } from "react";

import { ModuleEmptyState } from "../common";
import { useConvertHexAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useModulesByAddress } from "lib/services/move/module";
import type { BechAddr, HexAddr, IndexedModule, Option } from "lib/types";
import { isHexWalletAddress } from "lib/utils";

import { DrawerBodyDesktop } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "./types";

interface ModuleSelectDrawerProps {
  handleModuleSelect: ModuleSelectFunction;
  hexAddress: Option<HexAddr>;
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleSelectDrawer = ({
  handleModuleSelect,
  hexAddress,
  isOpen,
  onClose,
}: ModuleSelectDrawerProps) => {
  const { convertHexModuleAddress, convertHexWalletAddress } =
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
        <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
          <CustomIcon name="contract-address" boxSize={6} color="gray.600" />
          <Heading as="h5" variant="h5">
            Select Module
          </Heading>
        </DrawerHeader>
        <DrawerCloseButton color="text.dark" />
        <DrawerBody p={6}>
          <Flex h="full" direction="column">
            <ModuleSelector
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              closeModal={onClose}
              handleModuleSelect={handleModuleSelect}
              mode={mode}
              setMode={setMode}
              setModules={setModules}
            />
            {modules ? (
              <DrawerBodyDesktop
                selectedAddress={selectedAddress}
                closeModal={onClose}
                handleModuleSelect={handleModuleSelect}
                mode={mode}
                modules={modules}
              />
            ) : (
              <ModuleEmptyState
                hasImage
                description="Available functions for selected modules will display here"
              />
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
