import { Flex, Grid, Text } from "@chakra-ui/react";

import { TokenCard } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface SupportedAssetSectionContentProps {
  supportedAssets: TokenWithValue[];
  isAccount?: boolean;
  onViewMore?: () => void;
}

export const SupportedAssetSectionContent = ({
  supportedAssets,
  isAccount = false,
  onViewMore,
}: SupportedAssetSectionContentProps) => {
  if (!supportedAssets.length)
    return (
      <Flex
        w="full"
        alignItems="center"
        justifyContent={{ base: "flex-start", md: "center" }}
        h="calc(100% - 45px)"
        minH={20}
      >
        <Text variant="body2" color="text.dark">
          This {isAccount ? "address" : "contract"} does not hold any supported
          assets
        </Text>
      </Flex>
    );

  return (
    <Grid
      py={4}
      gridGap={4}
      gridTemplateColumns={{
        base: "1 fr",
        md: onViewMore ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      }}
    >
      {supportedAssets.map((asset) => (
        <TokenCard key={asset.denom} token={asset} minW="full" />
      ))}
    </Grid>
  );
};
