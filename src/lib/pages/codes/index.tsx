import { Heading, Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useInternalNavigate,
  useWasmConfig,
  useMobile,
} from "lib/app-provider";
import { StoredCodeCard } from "lib/components/card/StoredCodeCard";
import { FilterByPermission } from "lib/components/forms";
import { Loading } from "lib/components/Loading";
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
  useWasmConfig({ shouldRedirect: true });
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

  const emptyState = (
    <EmptyState
      imageVariant="empty"
      message="Most recent 100 code IDs will display here."
      withBorder
    />
  );
  const isMobile = useMobile();
  const MobileSection = () => {
    if (isLoading) return <Loading />;
    if (!recentCodes?.length) return emptyState;
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {recentCodes.map((code) => (
          <StoredCodeCard codeInfo={code} />
        ))}
      </Flex>
    );
  };

  return (
    <PageContainer>
      <Box pb={{ base: 0, md: 12 }}>
        <Heading variant="h5" as="h5" minH="36px">
          Recent Codes
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight="500" mb={8}>
          These codes are the most recently stored on this network
        </Text>
        <Flex
          gap={{ base: 6, md: 3 }}
          mt={8}
          direction={{ base: "column", md: "row" }}
        >
          <FilterByPermission
            maxWidth="full"
            initialSelected="all"
            setPermissionValue={(newVal: PermissionFilterValue) => {
              if (newVal === permissionValue) return;
              setValue("permissionValue", newVal);
            }}
          />
        </Flex>
      </Box>
      {isMobile ? (
        <MobileSection />
      ) : (
        <CodesTable
          codes={recentCodes}
          isLoading={isLoading}
          emptyState={emptyState}
          onRowSelect={onRowSelect}
        />
      )}
    </PageContainer>
  );
});

export default RecentCodes;
