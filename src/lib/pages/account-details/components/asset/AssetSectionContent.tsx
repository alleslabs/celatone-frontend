import { Grid, Text } from "@chakra-ui/react";

import { ErrorFetching } from "lib/components/state";
import { TokenCard } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface AssetSectionContentProps {
  supportedAssets: TokenWithValue[];
  error: Error;
}

export const AssetSectionContent = ({
  supportedAssets,
  error,
}: AssetSectionContentProps) => {
  if (error)
    return (
      <ErrorFetching message="There is an error during fetching balances." />
    );

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
      This address does not hold any supported assets
    </Text>
  );
};
