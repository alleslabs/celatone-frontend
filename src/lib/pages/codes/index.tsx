import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
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
      <PageHeader
        title="Codes"
        subtitle="This page displays all codes on this network sorted by recency"
        docHref="introduction/block-explorer#recent-codes"
      />
      <Flex direction="column" mt={8} mb={4}>
        <FilterByPermission
          maxWidth="full"
          initialSelected="all"
          setPermissionValue={(newVal: PermissionFilterValue) => {
            if (newVal === permissionValue) return;
            setValue("permissionValue", newVal);
          }}
        />
      </Flex>
      <RecentCodesTable permissionValue={permissionValue} />
    </PageContainer>
  );
});

export default RecentCodes;
