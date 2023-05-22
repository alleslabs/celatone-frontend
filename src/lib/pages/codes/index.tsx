import {
  Heading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useInternalNavigate } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { MySavedCodesSection } from "./components/MySavedCodesSection";
import { MyStoredCodesSection } from "./components/MyStoredCodesSection";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const Codes = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  const { watch, setValue } = useForm<CodeFilterState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    storedCodesCount,
    storedCodes: stored,
    savedCodesCount,
    savedCodes: saved,
    allCodesCount,
    isStoredCodesLoading,
    isSavedCodesLoading,
  } = useMyCodesData(keyword, permissionValue);

  const isSearching = !!keyword || permissionValue !== "all";

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_MY_CODES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Heading
        variant="h5"
        as="h5"
        minH="36px"
        display="flex"
        alignItems="center"
      >
        My Codes
      </Heading>
      <Tabs mt={8}>
        <TabList mb="32px" borderBottom="1px" borderColor="gray.800">
          <CustomTab count={allCodesCount}>All Codes</CustomTab>
          <CustomTab count={storedCodesCount}>My Stored Codes</CustomTab>
          <CustomTab count={savedCodesCount}>My Saved Codes </CustomTab>
        </TabList>
        <Flex gap={3} pb={4}>
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
          />
        </Flex>
        <TabPanels>
          <TabPanel p={0}>
            <MyStoredCodesSection
              codes={stored}
              isLoading={isStoredCodesLoading}
              onRowSelect={onRowSelect}
              disconnectedMessage="to see your previously uploaded and stored codes."
              isSearching={isSearching}
            />
            <MySavedCodesSection
              codes={saved}
              isLoading={isSavedCodesLoading}
              onRowSelect={onRowSelect}
              isSearching={isSearching}
            />
          </TabPanel>
          <TabPanel p="0px">
            <MyStoredCodesSection
              codes={stored}
              isLoading={isStoredCodesLoading}
              onRowSelect={onRowSelect}
              disconnectedMessage="to see your previously uploaded and stored codes."
              isSearching={isSearching}
            />
          </TabPanel>
          <TabPanel p="0px">
            <MySavedCodesSection
              codes={saved}
              isLoading={isSavedCodesLoading}
              onRowSelect={onRowSelect}
              isSearching={isSearching}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
});

export default Codes;
