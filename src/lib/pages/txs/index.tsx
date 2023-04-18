import { Flex, Heading, Text } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import { TxsTable } from "./components/TxsTable";

const Txs = () => (
  <PageContainer>
    <Flex direction="column" gap={2} mb={10}>
      <Heading variant="h5" as="h5">
        Transactions
      </Heading>
      <Text variant="body2" color="text.dark">
        This page displays all transactions in this network sorted by recency
      </Text>
    </Flex>
    <TxsTable isViewMore={false} />
  </PageContainer>
);

export default Txs;
