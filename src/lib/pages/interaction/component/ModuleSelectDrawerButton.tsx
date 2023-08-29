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
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { ModuleSelectBody } from "./select-module/ModuleSelectBody";
import {
  ModuleSelectorDisplay,
  ModuleSelectorInput,
} from "./select-module/ModuleSelector";
// import { ModuleEmptyState } from "./select-module/ModuleEmptyState";

interface ModuleSelectDrawerButtonProps {
  buttonText?: string;
}

export const ModuleSelectDrawerButton = ({
  buttonText = "Select Module",
}: ModuleSelectDrawerButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button variant="primary" ml="auto" onClick={onOpen}>
        {buttonText}
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
            <CustomIcon name="contract-address" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Select Module
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody p={6}>
            {/* Input */}
            <ModuleSelectorInput />
            {/* Selected Address */}
            <ModuleSelectorDisplay />
            <ModuleSelectBody />
            {/* <ModuleEmptyState /> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
