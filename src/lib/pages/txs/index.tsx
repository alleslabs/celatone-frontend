import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { TxsTable } from "./components/TxsTable";

const Txs = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_TXS);
  }, [router.isReady]);

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
