import type { BechAddr, HexAddr, IndexedModule, Option } from "lib/types";

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
import { useConvertHexAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ModuleCard } from "lib/components/module";
import { useModulesByAddress } from "lib/services/move/module";
import { useMoveVerifyInfosByAddress } from "lib/services/verification/move";
import { isHexWalletAddress, mergeModulePath } from "lib/utils";
import { useEffect, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "./types";

import { ModuleInteractionMobileStep } from "../../types";
import { ModuleEmptyState } from "../common";
import { SelectFunctionSection, SelectModuleSection } from "./body";
import { ModuleSelector } from "./selector";

interface ModuleSelectDrawerMobileProps {
  handleModuleSelect: ModuleSelectFunction;
  hexAddress: Option<HexAddr>;
  isOpen: boolean;
  onClose: () => void;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
  setStep: (step: ModuleInteractionMobileStep) => void;
  step: ModuleInteractionMobileStep;
}

export const ModuleSelectDrawerMobile = ({
  handleModuleSelect,
  hexAddress,
  isOpen,
  onClose,
  selectedModule,
  setSelectedModule,
  setStep,
  step,
}: ModuleSelectDrawerMobileProps) => {
  const { convertHexModuleAddress, convertHexWalletAddress } =
    useConvertHexAddress();
  const { data: moveVerifyInfos } = useMoveVerifyInfosByAddress(hexAddress);

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
        {step === ModuleInteractionMobileStep.SelectModule ? (
          <>
            <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
              <CustomIcon
                boxSize={6}
                color="gray.600"
                name="contract-address"
              />
              <Heading as="h5" variant="h5">
                Select module
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
                  <SelectModuleSection
                    modules={modules}
                    selectedAddress={selectedAddress}
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
            <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
              <CustomIcon
                boxSize={6}
                color="gray.600"
                cursor="pointer"
                name="chevron-left"
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
              <Flex direction="column" h="full">
                {selectedModule && (
                  <>
                    <Flex alignItems="center" gap={2} mb={2}>
                      <Text color="text.dark" fontWeight={600} variant="body2">
                        Selected Module
                      </Text>
                      <Button
                        leftIcon={<CustomIcon boxSize={3} name="swap" />}
                        px={1}
                        size="sm"
                        variant="ghost-primary"
                        onClick={() =>
                          setStep(ModuleInteractionMobileStep.SelectModule)
                        }
                      >
                        Change Module
                      </Button>
                    </Flex>
                    <ModuleCard
                      module={selectedModule}
                      moveVerifyInfo={
                        moveVerifyInfos?.[
                          mergeModulePath(
                            selectedModule.address,
                            selectedModule.moduleName
                          )
                        ]
                      }
                      readOnly
                      selectedModule={selectedModule}
                    />
                  </>
                )}
                <SelectFunctionSection
                  area="main"
                  closeModal={onClose}
                  handleModuleSelect={handleModuleSelect}
                  module={selectedModule}
                />
              </Flex>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
