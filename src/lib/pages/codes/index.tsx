import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
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
    <>
      <PageHeaderContainer bgColor="overlay.code">
        <PageHeader
          title="Codes"
          subtitle="This page displays all codes on this network sorted by recency"
          docHref="introduction/overview#recent-codes"
          mb={0}
        />
      </PageHeaderContainer>
      <PageContainer>
        <Box mb={4}>
          <FilterByPermission
            maxWidth="full"
            initialSelected="all"
            setPermissionValue={(newVal: PermissionFilterValue) => {
              if (newVal === permissionValue) return;
              setValue("permissionValue", newVal);
            }}
          />
        </Box>
        <RecentCodesTable permissionValue={permissionValue} />
      </PageContainer>
    </>
  );
});

export default RecentCodes;
