import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";

import { TxsTable } from "./components/TxsTable";

const Txs = () => {
  const router = useRouter();
  const { track } = useTrack();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_TXS);
  }, [router.isReady, track]);

  return (
    <PageContainer>
      <Heading variant="h5" as="h5" minH="36px">
        Transactions
      </Heading>
      <Text variant="body2" color="text.dark" mb={8}>
        This page displays all transactions on this network sorted by recency
      </Text>
      <TxsTable isViewMore={false} />
    </PageContainer>
  );
};

export default Txs;
