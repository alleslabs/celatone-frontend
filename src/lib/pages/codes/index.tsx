import { Heading, Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useInternalNavigate } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import type { PermissionFilterValue } from "lib/hooks";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { useRecentCodesData } from "./data";

interface RecentCodesState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const RecentCodes = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  const { watch, setValue } = useForm<RecentCodesState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();
  const { recentCodes, isLoading } = useRecentCodesData(
    keyword,
    permissionValue
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_RECENT_CODES);
  }, [router.isReady]);

  const isSearching = Boolean(keyword) || permissionValue !== "all";

  return (
    <PageContainer>
      <Box pb={12}>
        <Heading
          variant="h5"
          as="h5"
          minH="36px"
          display="flex"
          alignItems="center"
        >
          Recent Codes
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight="500">
          These codes are the most recently stored on this network
        </Text>
        <Flex gap={3} mt={8}>
          <InputWithIcon
            placeholder="Search with Code ID or Code Name"
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
      </Box>
      <CodesTable
        codes={recentCodes}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant={isSearching ? "not-found" : "empty"}
            message={
              isSearching
                ? "No matched codes found"
                : "Most recent 100 code IDs will display here."
            }
            withBorder
          />
        }
        onRowSelect={onRowSelect}
      />
    </PageContainer>
  );
});

export default RecentCodes;
