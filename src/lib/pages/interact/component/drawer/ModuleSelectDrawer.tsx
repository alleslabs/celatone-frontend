import {
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ModuleEmptyState } from "../common";
import { useConvertHexAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import {
  useAccountModules,
  type IndexedModule,
} from "lib/services/move/moduleService";
import type { HexAddr, HumanAddr, MoveAccountAddr, Option } from "lib/types";

import { ModuleSelectMainBody } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  SelectedAddress,
  ModuleSelectFunction,
} from "./types";

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
  const convertHexAddr = useConvertHexAddress();

  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as HumanAddr,
    hex: "" as HexAddr,
  });
  const [modules, setModules] = useState<IndexedModule[]>();

  const { refetch } = useAccountModules({
    address: selectedAddress.hex as MoveAccountAddr,
    moduleName: undefined,
    functionName: undefined,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        if (Array.isArray(data)) setModules(data);
      },
    },
  });

  useEffect(() => {
    if (hexAddress) {
      setMode("display");
      setSelectedAddress({
        address: convertHexAddr(hexAddress),
        hex: hexAddress,
      });
    } else {
      setMode("input");
      setSelectedAddress({
        address: "" as HumanAddr,
        hex: "" as HexAddr,
      });
      setModules(undefined);
    }
  }, [convertHexAddr, hexAddress]);

  useEffect(() => {
    if (isOpen && selectedAddress.hex) refetch();
  }, [isOpen, refetch, selectedAddress.hex]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
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
              mode={mode}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              setModules={setModules}
              setMode={setMode}
              handleModuleSelect={handleModuleSelect}
              closeModal={onClose}
            />
            {modules ? (
              <ModuleSelectMainBody
                selectedAddress={selectedAddress}
                mode={mode}
                modules={modules}
                handleModuleSelect={handleModuleSelect}
                closeModal={onClose}
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
