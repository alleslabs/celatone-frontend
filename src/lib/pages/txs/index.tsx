import { Heading, Text } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import { TxsTable } from "./components/TxsTable";

const Txs = () => (
  <PageContainer>
    <Heading variant="h5" as="h5">
      Transactions
    </Heading>
    <Text variant="body2" color="text.dark" mb={8} mt={1}>
      This page displays all transactions in this network sorted by recency
    </Text>
    <TxsTable isViewMore={false} />
  </PageContainer>
);

export default Txs;
