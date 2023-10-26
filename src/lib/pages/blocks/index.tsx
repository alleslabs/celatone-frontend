import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";

import { BlocksTable } from "./components/BlocksTable";

const BlocksPage = () => {
  const router = useRouter();
  const { track } = useTrack();
  const navigate = useInternalNavigate();
  const onRowSelect = (blockHeight: number) =>
    navigate({
      pathname: "/blocks/[blockHeight]",
      query: { blockHeight },
    });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_BLOCKS);
  }, [router.isReady, track]);

  return (
    <PageContainer>
      <Heading as="h5" variant="h5" minH="36px">
        Blocks
      </Heading>
      <Text variant="body2" fontWeight={500} color="text.dark" mb={8}>
        This page displays all blocks on this network sorted by recency
      </Text>
      <BlocksTable onRowSelect={onRowSelect} />
    </PageContainer>
  );
};

export default BlocksPage;
