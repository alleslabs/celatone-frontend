import { Heading, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";

import { RecentContractsTable } from "./components/RecentContractsTable";

const RecentContracts = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CONTRACTS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Box>
        <Heading variant="h5" as="h5" minH="36px">
          Contracts
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight={500} mb={8}>
          This page displays all contracts on this network sorted by recency
        </Text>
      </Box>
      <RecentContractsTable />
    </PageContainer>
  );
};

export default RecentContracts;
