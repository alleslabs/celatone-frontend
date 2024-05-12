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
import { useModulesByAddressLcd } from "lib/services/move/moduleService";
import type {
  BechAddr,
  // ExposedFunction,
  HexAddr,
  IndexedModule,
  Option,
} from "lib/types";
import { isHexWalletAddress } from "lib/utils";

import { ModuleSelectMainBody } from "./body";
import { ModuleSelector } from "./selector";
import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
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
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const [mode, setMode] = useState<DisplayMode>("input");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    address: "" as BechAddr,
    hex: "" as HexAddr,
  });
  const [modules, setModules] = useState<IndexedModule[]>();
  const [step, setStep] = useState<"select-module" | "select-fn">(
    // eslint-disable-next-line sonarjs/no-duplicate-string
    "select-module"
  );

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
        {step === "select-module" ? (
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
                  <ModuleSelectMainBody
                    selectedAddress={selectedAddress}
                    mode={mode}
                    modules={modules}
                    handleModuleSelect={handleModuleSelect}
                    closeModal={onClose}
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
                onClick={() => setStep("select-module")}
              />
              <Heading as="h5" variant="h5">
                Select Function
              </Heading>
            </DrawerHeader>
            <DrawerCloseButton color="text.dark" />
            <DrawerBody p={6}>
              <Flex h="full" direction="column">
                {/* <ModuleCard
                  selectedAddress={selectedAddress.address}
                  module={module}
                  selectedModule={selectedModule}
                /> */}
              </Flex>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
