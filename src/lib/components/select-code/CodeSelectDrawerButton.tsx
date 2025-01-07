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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { CustomTab } from "../CustomTab";
import { FilterByPermission } from "../forms";
import { CustomIcon } from "../icon";
import InputWithIcon from "../InputWithIcon";
import { MySavedCodesTable, MyStoredCodesTable } from "../table";
import { AmpEvent, track } from "lib/amplitude";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

interface CodeSelectDrawerButtonProps {
  buttonText: string;
  onCodeSelect: (code: number) => void;
}

export const CodeSelectDrawerButton = ({
  buttonText,
  onCodeSelect,
}: CodeSelectDrawerButtonProps) => {
  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const { setValue, watch } = useForm<CodeFilterState>({
    defaultValues: {
      keyword: "",
      permissionValue: "all",
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { keyword, permissionValue } = watch();

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const {
    isSavedCodesLoading,
    isStoredCodesLoading,
    savedCodes: saved,
    savedCodesCount,
    storedCodes: stored,
    storedCodesCount,
  } = useMyCodesData(keyword, permissionValue);

  const handleSelect = (codeId: number) => {
    onCodeSelect(codeId);
    onClose();
  };

  return (
    <>
      <Button
        ml="auto"
        variant="outline-primary"
        w="120px"
        onClick={() => {
          track(AmpEvent.USE_CODE_MODAL);
          onOpen();
        }}
      >
        {buttonText}
      </Button>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader>
            <CustomIcon name="code" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Select Code ID
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={0} py={4} overflow="scroll">
            <Flex gap={4} mb={4} px={6} py={2}>
              <InputWithIcon
                size={{ base: "md", md: "lg" }}
                value={keyword}
                amptrackSection="code-drawer-search"
                autoFocus
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue("keyword", e.target.value)
                }
                placeholder="Search with Code ID or Code Name"
              />
              <FilterByPermission
                initialSelected="all"
                labelBgColor="gray.900"
                setPermissionValue={(newVal: PermissionFilterValue) => {
                  if (newVal === permissionValue) return;
                  setValue("permissionValue", newVal);
                }}
              />
            </Flex>
            <Tabs px={6}>
              <TabList borderBottom="1px" borderColor="gray.800">
                <CustomTab count={storedCodesCount}>My Stored Codes</CustomTab>
                <CustomTab count={savedCodesCount}>My Saved Codes</CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <MyStoredCodesTable
                    emptyMessage="You don’t have any stored codes in this device."
                    isReadOnly
                    codes={stored}
                    disconnectedMessage="to see your stored code."
                    isLoading={isStoredCodesLoading}
                    onRowSelect={handleSelect}
                    totalData={storedCodesCount}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MySavedCodesTable
                    isReadOnly
                    codes={saved}
                    isLoading={isSavedCodesLoading}
                    onRowSelect={handleSelect}
                    totalData={savedCodesCount}
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
