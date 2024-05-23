import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ModuleInteractionMobileStep } from "../../types";
import { ModuleEmptyState } from "../common";
import { useConvertHexAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ModuleCard } from "lib/components/module";
import { useModulesByAddressLcd } from "lib/services/move/moduleService";
import type { BechAddr, HexAddr, IndexedModule, Option } from "lib/types";
import { isHexWalletAddress } from "lib/utils";

import { SelectFunctionSection, SelectModuleSection } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "./types";

interface ModuleSelectDrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  hexAddress: Option<HexAddr>;
  handleModuleSelect: ModuleSelectFunction;
  step: ModuleInteractionMobileStep;
  setStep: (step: ModuleInteractionMobileStep) => void;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
}

export const ModuleSelectDrawerMobile = ({
  isOpen,
  onClose,
  hexAddress,
  handleModuleSelect,
  step,
  setStep,
  selectedModule,
  setSelectedModule,
}: ModuleSelectDrawerMobileProps) => {
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as BechAddr,
    hex: "" as HexAddr,
  });
  const [modules, setModules] = useState<IndexedModule[]>();

  const { refetch } = useModulesByAddressLcd({
    address: selectedAddress.hex,
    options: {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        setModules(data);
      },
    },
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
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
      <DrawerOverlay />
      <DrawerContent h="90%">
        {step === ModuleInteractionMobileStep.SelectModule ? (
          <>
            <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
              <CustomIcon
                name="contract-address"
                boxSize={6}
                color="gray.600"
              />
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
                  <SelectModuleSection
                    selectedAddress={selectedAddress}
                    modules={modules}
                    selectedModule={selectedModule}
                    setSelectedModule={setSelectedModule}
                    setStep={setStep}
                  />
                ) : (
                  <ModuleEmptyState
                    description="Available functions for selected modules will display here"
                    hasImage
                  />
                )}
              </Flex>
            </DrawerBody>
          </>
        ) : (
          <>
            <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
              <CustomIcon
                name="chevron-left"
                boxSize={6}
                color="gray.600"
                cursor="pointer"
                onClick={() =>
                  setStep(ModuleInteractionMobileStep.SelectModule)
                }
              />
              <Heading as="h5" variant="h5">
                Select Function
              </Heading>
            </DrawerHeader>
            <DrawerCloseButton color="text.dark" />
            <DrawerBody p={6}>
              <Flex h="full" direction="column">
                {selectedModule && (
                  <>
                    <Flex alignItems="center" gap={2} mb={2}>
                      <Text variant="body2" fontWeight={600} color="text.dark">
                        Selected Module
                      </Text>
                      <Button
                        onClick={() =>
                          setStep(ModuleInteractionMobileStep.SelectModule)
                        }
                        size="sm"
                        px={1}
                        variant="ghost-primary"
                        leftIcon={<CustomIcon name="swap" boxSize={3} />}
                      >
                        Change Module
                      </Button>
                    </Flex>
                    <ModuleCard
                      selectedAddress={selectedAddress.address}
                      module={selectedModule}
                      selectedModule={selectedModule}
                      readOnly
                    />
                  </>
                )}
                <SelectFunctionSection
                  area="main"
                  module={selectedModule}
                  handleModuleSelect={handleModuleSelect}
                  closeModal={onClose}
                />
              </Flex>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
