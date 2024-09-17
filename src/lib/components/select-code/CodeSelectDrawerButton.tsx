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
  onCodeSelect: (code: number) => void;
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
    onCodeSelect(codeId);
    onClose();
  };

  return (
    <>
      <Button
        variant="outline-primary"
        ml="auto"
        w="120px"
        onClick={() => {
          track(AmpEvent.USE_CODE_MODAL);
          onOpen();
        }}
      >
        {buttonText}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader>
            <CustomIcon name="code" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Select Code ID
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={0} overflow="scroll" py={4}>
            <Flex gap={4} px={6} py={2} mb={4}>
              <InputWithIcon
                placeholder="Search with Code ID or Code Name"
                value={keyword}
                autoFocus
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue("keyword", e.target.value)
                }
                size={{ base: "md", md: "lg" }}
                amptrackSection="code-drawer-search"
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
                <CustomTab count={savedCodesCount}>My Saved Codes</CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <MyStoredCodesTable
                    codes={stored}
                    totalData={storedCodesCount}
                    isLoading={isStoredCodesLoading}
                    onRowSelect={handleSelect}
                    emptyMessage="You don’t have any stored codes in this device."
                    disconnectedMessage="to see your stored code."
                    isReadOnly
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MySavedCodesTable
                    codes={saved}
                    totalData={savedCodesCount}
                    isLoading={isSavedCodesLoading}
                    onRowSelect={handleSelect}
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
