import { Flex, Grid, Text } from "@chakra-ui/react";

import { TokenCard } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface SupportedAssetSectionContentProps {
  isAccount?: boolean;
  onViewMore?: () => void;
  supportedAssets: TokenWithValue[];
}

export const SupportedAssetSectionContent = ({
  isAccount = false,
  onViewMore,
  supportedAssets,
}: SupportedAssetSectionContentProps) => {
  if (!supportedAssets.length)
    return (
      <Flex
        alignItems="center"
        h="calc(100% - 45px)"
        minH={20}
        w="full"
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        <Text variant="body2" color="text.dark">
          This {isAccount ? "address" : "contract"} does not hold any supported
          assets
        </Text>
      </Flex>
    );

  return (
    <Grid
      gridGap={4}
      gridTemplateColumns={{
        base: "1 fr",
        md: onViewMore ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      }}
      py={4}
    >
      {supportedAssets.map((asset) => (
        <TokenCard key={asset.denom} minW="full" token={asset} />
      ))}
    </Grid>
  );
};
