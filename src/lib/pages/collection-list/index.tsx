import { Heading, Text } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import Collections from "./components/Collections";

const NftCollections = () => (
  <PageContainer>
    <Heading as="h5" variant="h5" minH="36px">
      NFT Collections
    </Heading>
    <Text variant="body2" fontWeight={500} color="text.dark" mb={8}>
      These are the most recently NFT collections created on this network
    </Text>
    <Collections />
  </PageContainer>
);

export default NftCollections;
