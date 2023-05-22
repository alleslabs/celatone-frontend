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
import { MySavedCodesTable, MyStoredCodesTable } from "../table";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

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

  const handleSelect = (codeId: number) => {
    onCodeSelect(codeId.toString());
    onClose();
  };

  const isSearching = !!keyword || permissionValue !== "all";

  return (
    <>
      <Button
        variant="outline-primary"
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
          <DrawerHeader borderBottom="1px solid" borderColor="gray.700">
            <CustomIcon name="code" boxSize="6" color="gray.600" />
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
              <TabList borderBottom="1px" borderColor="gray.800">
                <CustomTab count={storedCodesCount}>My Stored Codes</CustomTab>
                <CustomTab count={savedCodesCount}>My Saved Codes </CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <MyStoredCodesTable
                    codes={stored}
                    isLoading={isStoredCodesLoading}
                    onRowSelect={handleSelect}
                    emptyMessage="You don’t have any stored codes in this device."
                    disconnectedMessage="to see your stored code."
                    isSearching={isSearching}
                    isReadOnly
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MySavedCodesTable
                    codes={saved}
                    isLoading={isSavedCodesLoading}
                    onRowSelect={handleSelect}
                    emptyMessage="You don’t have any saved codes in this device."
                    isSearching={isSearching}
                    isReadOnly
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
