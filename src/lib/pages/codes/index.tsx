import { Heading, Box, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import PageContainer from "lib/components/PageContainer";
import type { PermissionFilterValue } from "lib/hooks";

import { RecentCodesTable } from "./components/RecentCodesTable";

interface RecentCodesState {
  permissionValue: PermissionFilterValue;
}

const RecentCodes = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  const { watch, setValue } = useForm<RecentCodesState>({
    defaultValues: {
      permissionValue: "all",
    },
  });
  const { permissionValue } = watch();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CODES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Box>
        <Heading variant="h5" as="h5" minH="36px">
          Codes
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight="500" mb={8}>
          This page displays all codes on this network sorted by recency
        </Text>
        <Box mt={8} mb={4}>
          <FilterByPermission
            maxWidth="full"
            initialSelected="all"
            setPermissionValue={(newVal: PermissionFilterValue) => {
              if (newVal === permissionValue) return;
              setValue("permissionValue", newVal);
            }}
          />
        </Box>
      </Box>
      <RecentCodesTable permissionValue={permissionValue} />
    </PageContainer>
  );
});

export default RecentCodes;
