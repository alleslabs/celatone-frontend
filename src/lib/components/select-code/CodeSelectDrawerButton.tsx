import type { PermissionFilterValue } from "lib/hooks";
import type { ChangeEvent } from "react";

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
import { AmpEvent, track } from "lib/amplitude";
import { useMyCodesData } from "lib/model/code";
import { useForm } from "react-hook-form";

import { CustomTab } from "../CustomTab";
import { FilterByPermission } from "../forms";
import { CustomIcon } from "../icon";
import InputWithIcon from "../InputWithIcon";
import { MySavedCodesTable, MyStoredCodesTable } from "../table";

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
            <CustomIcon boxSize={6} color="gray.600" name="code" />
            <Heading as="h5" variant="h5">
              Select code ID
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody overflow="scroll" px={0} py={4}>
            <Flex gap={4} mb={4} px={6} py={2}>
              <InputWithIcon
                amptrackSection="code-drawer-search"
                autoFocus
                placeholder="Search with code ID or code name"
                size={{ base: "md", md: "lg" }}
                value={keyword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue("keyword", e.target.value)
                }
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
              <TabList borderBottomWidth="1px" borderColor="gray.800">
                <CustomTab count={storedCodesCount}>My stored codes</CustomTab>
                <CustomTab count={savedCodesCount}>My saved codes</CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <MyStoredCodesTable
                    codes={stored}
                    disconnectedMessage="to see your stored code."
                    emptyMessage="You don’t have any stored codes in this device."
                    isLoading={isStoredCodesLoading}
                    isReadOnly
                    totalData={storedCodesCount}
                    onRowSelect={handleSelect}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MySavedCodesTable
                    codes={saved}
                    isLoading={isSavedCodesLoading}
                    isReadOnly
                    totalData={savedCodesCount}
                    onRowSelect={handleSelect}
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
