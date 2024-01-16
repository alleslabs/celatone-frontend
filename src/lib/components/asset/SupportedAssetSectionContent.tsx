import { Flex, Grid, Text } from "@chakra-ui/react";

import { ErrorFetching } from "lib/components/state";
import { TokenCard } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface SupportedAssetSectionContentProps {
  supportedAssets: TokenWithValue[];
  error: Error;
  isAccount?: boolean;
  onViewMore?: () => void;
}

export const SupportedAssetSectionContent = ({
  supportedAssets,
  error,
  isAccount = false,
  onViewMore,
}: SupportedAssetSectionContentProps) => {
  if (error) return <ErrorFetching dataName="balances" />;

  return supportedAssets.length ? (
    <Grid
      p={4}
      gridGap={4}
      gridTemplateColumns={{
        base: "1 fr",
        md: onViewMore ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
      }}
    >
      {supportedAssets.map((asset) => (
        <TokenCard key={asset.denom} token={asset} minW="full" />
      ))}
    </Grid>
  ) : (
    <Flex p={12} alignItems="center" justifyContent="center">
      <Text variant="body2" color="text.dark">
        This {isAccount ? "address" : "contract"} does not hold any supported
        assets
      </Text>
    </Flex>
  );
};
