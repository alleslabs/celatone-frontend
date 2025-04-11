import type { TokenWithValue } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { TokenCard } from "lib/components/token";

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
        alignItems="center"
        h="calc(100% - 45px)"
        justifyContent={{ base: "flex-start", md: "center" }}
        minH={20}
        w="full"
      >
        <Text color="text.dark" variant="body2">
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
