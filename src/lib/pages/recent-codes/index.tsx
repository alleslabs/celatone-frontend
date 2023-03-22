import { Heading, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useCallback, useEffect } from "react";
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

const useOnRowSelect = () => {
  const navigate = useInternalNavigate();
  return useCallback(
    (codeId: number) =>
      navigate({
        pathname: "/code/[codeId]",
        query: { codeId },
      }),
    [navigate]
  );
};

const RecentCodes = observer(() => {
  const router = useRouter();
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

  const isSearching = !!keyword || permissionValue !== "all";

  return (
    <PageContainer>
      <Box pb="48px">
        <Heading as="h1" size="lg" mb={4}>
          Recent Codes
        </Heading>
        <Flex gap={2}>
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
      </Box>
      <CodesTable
        codes={recentCodes}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message={
              isSearching
                ? "No matched codes found"
                : "Most recent 100 code IDs will display here."
            }
            withBorder
          />
        }
        onRowSelect={useOnRowSelect()}
      />
    </PageContainer>
  );
});

export default RecentCodes;
