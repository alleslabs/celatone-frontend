import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { ShowMoreButton } from "lib/components/button";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { TokenCard } from "lib/components/TokenCard";
import type { BalanceWithAssetInfo, Option } from "lib/types";

interface TokenSectionProps {
  balances: Option<BalanceWithAssetInfo[]>;
}
export const TokenSection = ({ balances }: TokenSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const unsupportedAssets = useMemo(
    () => balances?.filter((balance) => !balance.assetInfo) ?? [],
    [balances]
  );

  const supportedAssets = useMemo(
    () => balances?.filter((balance) => balance.assetInfo) ?? [],
    [balances]
  );

  const renderContext = () => {
    if (!balances?.length) {
      return (
        <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
          This contract does not hold any assets
        </Text>
      );
    }
    return (
      <>
        <Grid gridGap={4} gridTemplateColumns="repeat(4, 1fr)">
          {supportedAssets.map((balance, index) => {
            if (!showMore && index >= 4) {
              return null;
            }
            return <TokenCard key={balance.balance.id} userBalance={balance} />;
          })}
        </Grid>
        {supportedAssets.length > 4 && (
          <ShowMoreButton
            showMoreText="View All Assets"
            showLessText="View Less Assets"
            toggleShowMore={showMore}
            setToggleShowMore={() => setShowMore(!showMore)}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Flex justify="space-between">
        <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
          Assets
        </Text>
        <UnsupportedTokensModal unsupportedAssets={unsupportedAssets} />
      </Flex>
      {renderContext()}
    </>
  );
};
