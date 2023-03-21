import {
  Button,
  useDisclosure,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { CustomTab } from "../CustomTab";
import { FilterByPermission } from "../forms";
import { CustomIcon } from "../icon";
import InputWithIcon from "../InputWithIcon";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { MySavedCodeContent } from "./MySavedCodeContent";
import { MyStoredCodeContent } from "./MyStoredCodeContent";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

interface CodeSelectDrawerButtonProps {
  onCodeSelect: (code: string) => void;
  buttonText: string;
}

export const CodeSelectDrawerButton = ({
  onCodeSelect,
  buttonText,
}: CodeSelectDrawerButtonProps) => {
  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const { watch, setValue } = useForm<CodeFilterState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyword, permissionValue } = watch();

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const {
    storedCodesCount,
    storedCodes: stored,
    savedCodesCount,
    savedCodes: saved,
    isStoredCodesLoading,
    isSavedCodesLoading,
  } = useMyCodesData(keyword, permissionValue);

  const handleSelect = (code: string) => {
    onCodeSelect(code);
    onClose();
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="md"
        ml="auto"
        w="120px"
        onClick={() => {
          AmpTrack(AmpEvent.USE_CODE_MODAL);
          onOpen();
        }}
      >
        {buttonText}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader borderBottom="1px solid" borderColor="pebble.700">
            <CustomIcon name="code" boxSize="6" />
            <Heading as="h5" variant="h5">
              Select Code ID
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={0} overflow="scroll">
            <Flex gap={2} px={6} py={2}>
              <InputWithIcon
                placeholder="Search with code ID or code name"
                value={keyword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue("keyword", e.target.value)
                }
                size="lg"
              />
              <FilterByPermission
                initialSelected="all"
                setPermissionValue={(newVal: PermissionFilterValue) => {
                  if (newVal === permissionValue) return;
                  setValue("permissionValue", newVal);
                }}
                labelBgColor="gray.900"
              />
            </Flex>
            <Tabs px={6}>
              <TabList mb={6} borderBottom="1px" borderColor="pebble.800">
                <CustomTab count={storedCodesCount}>My Stored Codes</CustomTab>
                <CustomTab count={savedCodesCount}>My Saved Codes </CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <MyStoredCodeContent
                    storedCodes={stored}
                    handleSelect={handleSelect}
                    isLoading={isStoredCodesLoading}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MySavedCodeContent
                    savedCodes={saved}
                    handleSelect={handleSelect}
                    isLoading={isSavedCodesLoading}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
