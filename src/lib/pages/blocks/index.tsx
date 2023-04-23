import { Heading, Text } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import { BlocksTable } from "./components/BlocksTable";

const BlocksPage = () => {
  return (
    <PageContainer>
      <Heading as="h5" variant="h5">
        Blocks
      </Heading>
      <Text variant="body2" fontWeight={500} color="text.dark" mt={1} mb={8}>
        This page displays all blocks in this network sorted by recency
      </Text>
      <BlocksTable />
    </PageContainer>
  );
};

export default BlocksPage;
