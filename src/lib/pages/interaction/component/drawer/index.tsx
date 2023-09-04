import {
  Button,
  Heading,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import type { IndexedModule } from "lib/services/moduleService";
import type { HexAddr, HumanAddr } from "lib/types";

import { ModuleEmptyState, ModuleSelectMainBody } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  SelectedAddress,
  ModuleSelectFunction,
} from "./types";

interface ModuleSelectDrawerTriggerProps {
  buttonText?: string;
  handleModuleSelect: ModuleSelectFunction;
}

export const ModuleSelectDrawerTrigger = ({
  buttonText = "Select Module",
  handleModuleSelect,
}: ModuleSelectDrawerTriggerProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [modules, setModules] = useState<IndexedModule[]>();
  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as HumanAddr,
    hex: "" as HexAddr,
  });

  return (
    <>
      <Button variant="primary" ml="auto" onClick={onOpen}>
        {buttonText}
      </Button>
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
                  mode={mode}
                  modules={modules}
                  handleModuleSelect={handleModuleSelect}
                  closeModal={onClose}
                />
              ) : (
                <ModuleEmptyState />
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
