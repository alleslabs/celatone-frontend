import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { ShowMoreButton } from "lib/components/button";
import type { BalanceWithAssetInfo, Option } from "lib/types";

import { TokenCard } from "./TokenCard";

interface TokenSectionProps {
  balances: Option<BalanceWithAssetInfo[]>;
}
export const TokenSection = ({ balances }: TokenSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const supportedAssets = useMemo(
    () => balances?.filter((balance) => balance?.assetInfo),
    [balances]
  );

  if (!balances)
    return (
      <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
        This contract does not hold any assets
      </Text>
    );

  return (
    <Flex direction="column">
      <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
        Assets
      </Text>
      {/* TODO - Implement unsupported assets */}
      <Grid gridGap={4} gridTemplateColumns="repeat(4, 1fr)">
        {supportedAssets?.map((balance, index) => {
          if (!showMore && index >= 4) {
            return null;
          }
          return <TokenCard key={balance.balance.id} userBalance={balance} />;
        })}
      </Grid>
      {supportedAssets && supportedAssets?.length > 4 && (
        <ShowMoreButton
          showMoreText="View All Assets"
          showLessText="View Less Assets"
          toggleShowMore={showMore}
          setToggleShowMore={() => setShowMore(!showMore)}
        />
      )}
    </Flex>
  );
};
