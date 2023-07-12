import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { BlocksTable } from "./components/BlocksTable";

const BlocksPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_BLOCKS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Heading as="h5" variant="h5" minH="36px">
        Blocks
      </Heading>
      <Text variant="body2" fontWeight={500} color="text.dark" mb={8}>
        This page displays all blocks on this network sorted by recency
      </Text>
      <BlocksTable />
    </PageContainer>
  );
};

export default BlocksPage;
