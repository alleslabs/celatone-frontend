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
import { useState } from "react";

import { ModuleEmptyState } from "../common";
import { CustomIcon } from "lib/components/icon";
import type { IndexedModule } from "lib/services/move/moduleService";
import type { HexAddr, HumanAddr } from "lib/types";

import { ModuleSelectMainBody } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  SelectedAddress,
  ModuleSelectFunction,
} from "./types";

interface ModuleSelectDrawerTriggerProps {
  isOpen: boolean;
  onClose: () => void;
  handleModuleSelect: ModuleSelectFunction;
}

export const ModuleSelectDrawer = ({
  isOpen,
  onClose,
  handleModuleSelect,
}: ModuleSelectDrawerTriggerProps) => {
  const [modules, setModules] = useState<IndexedModule[]>();
  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as HumanAddr,
    hex: "" as HexAddr,
  });

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
              setMode={setMode}
              handleModuleSelect={handleModuleSelect}
              setModules={setModules}
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
