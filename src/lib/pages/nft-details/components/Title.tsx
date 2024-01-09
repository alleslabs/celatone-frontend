import { Flex, Heading, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import type { HexAddr32 } from "lib/types";

interface TitleProps {
  collectionAddress: HexAddr32;
  displayCollectionName: string;
  tokenId: string;
}

export const Title = ({
  collectionAddress,
  displayCollectionName,
  tokenId,
}: TitleProps) => (
  <Flex direction="column">
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Text color="primary.main" fontSize="16px" fontWeight={700}>
        {displayCollectionName}
      </Text>
    </AppLink>
    <Heading variant="h5" as="h5">
      {tokenId}
    </Heading>
  </Flex>
);
