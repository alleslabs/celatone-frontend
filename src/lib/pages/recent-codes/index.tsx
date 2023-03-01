import { Heading, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import type { PermissionFilterValue } from "lib/hooks";
import CodesTable from "lib/pages/codes/components/CodesTable";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { useRecentCodesData } from "./data";

interface RecentCodesState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

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

  return (
    <Box>
      <Box p="48px">
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
        isLoading={isLoading}
        type="recent"
        tableName="Recent Codes"
        codes={recentCodes}
        isSearching={!!keyword}
      />
    </Box>
  );
});

export default RecentCodes;
