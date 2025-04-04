import { Flex, Grid } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useState } from "react";

import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { ShowMoreButton } from "lib/components/button";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { TokenCard } from "lib/components/token/TokenCard";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { coinToTokenWithValue, filterSupportedTokens } from "lib/utils";

interface CoinsComponentProps {
  coins: Coin[];
}

export const CoinsComponent = ({ coins }: CoinsComponentProps) => {
  const isMobile = useMobile();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });
  const [showMore, setShowMore] = useState(false);

  if (!coins.length) return <>No assets</>;
  if (!assetInfos) return <>{JSON.stringify(coins)}</>;

  const tokens = coins.map((coin) =>
    coinToTokenWithValue(coin.denom, coin.amount, assetInfos, movePoolInfos)
  );
  const { supportedTokens, unsupportedTokens } = filterSupportedTokens(tokens);
  const hasSupportedTokens = supportedTokens.length > 0;

  return (
    <Flex direction="column" w="full">
      {hasSupportedTokens && (
        <Grid gridGap={4} gridTemplateColumns={isMobile ? "1fr" : "1fr 1fr"}>
          {supportedTokens.slice(0, showMore ? undefined : 2).map((token) => (
            <TokenCard
              key={token.denom}
              token={token}
              amptrackSection="tx_msg_receipts_assets"
            />
          ))}
        </Grid>
      )}
      <Flex gap={2} mt={hasSupportedTokens ? 2 : 0}>
        {supportedTokens.length > 2 && (
          <ShowMoreButton
            showMoreText="View all assets"
            showLessText="View less assets"
            toggleShowMore={showMore}
            setToggleShowMore={() => {
              trackUseExpand({
                action: showMore ? "collapse" : "expand",
                component: "assets",
                section: "tx_page",
              });
              setShowMore(!showMore);
            }}
          />
        )}
        <UnsupportedTokensModal
          unsupportedAssets={unsupportedTokens}
          buttonProps={{ fontSize: "12px", mb: 0 }}
          amptrackSection="tx_msg_receipts_unsupported_assets"
        />
      </Flex>
    </Flex>
  );
};
