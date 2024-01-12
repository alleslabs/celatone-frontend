import { Grid, Text } from "@chakra-ui/react";

import { ErrorFetching } from "lib/components/state";
import { TokenCard } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface SupportedAssetSectionContentProps {
  supportedAssets: TokenWithValue[];
  error: Error;
  isAccount?: boolean;
}

export const SupportedAssetSectionContent = ({
  supportedAssets,
  error,
  isAccount = false,
}: SupportedAssetSectionContentProps) => {
  if (error) return <ErrorFetching dataName="balances" />;

  return supportedAssets.length ? (
    <Grid
      gridGap={4}
      gridTemplateColumns={{ base: "1 fr", md: "repeat(4, 1fr)" }}
    >
      {supportedAssets.map((asset) => (
        <TokenCard key={asset.denom} token={asset} minW="full" />
      ))}
    </Grid>
  ) : (
    <Text variant="body2" color="text.dark">
      This {isAccount ? "address" : "contract"} does not hold any supported
      assets
    </Text>
  );
};
