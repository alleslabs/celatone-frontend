import { Button, Grid, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TokenCard } from "lib/components/token";
import type { Option, TokenWithValue } from "lib/types";

interface SupportedTokensSectionProps {
  total: Option<number>;
  isBalancesLoading: boolean;
  supportedAssets: TokenWithValue[];
  onViewMore?: () => void;
}

export const SupportedTokensSection = ({
  total,
  isBalancesLoading,
  supportedAssets,
  onViewMore,
}: SupportedTokensSectionProps) => {
  if (isBalancesLoading) return <Loading />;
  if (!total)
    return (
      <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
        This contract does not hold any assets
      </Text>
    );
  return (
    <>
      <Grid
        gridGap={4}
        gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
      >
        {supportedAssets.slice(0, onViewMore ? 4 : undefined).map((balance) => (
          <TokenCard key={balance.denom} token={balance} />
        ))}
      </Grid>

      {supportedAssets.length > 4 && onViewMore && (
        <Button
          p={0}
          mt={1}
          color="secondary.main"
          variant="none"
          w="fit-content"
          onClick={() => {
            onViewMore();
          }}
        >
          <Text variant="body3" color="secondary.main" fontWeight={700}>
            View All Assets
          </Text>
          <CustomIcon name="chevron-right" boxSize={3} />
        </Button>
      )}
    </>
  );
};
