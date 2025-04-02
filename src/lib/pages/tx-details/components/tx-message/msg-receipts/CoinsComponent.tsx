import type { Coin } from "@cosmjs/stargate";

import { Flex, Grid } from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { ShowMoreButton } from "lib/components/button";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { TokenCard } from "lib/components/token/TokenCard";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import { coinToTokenWithValue, filterSupportedTokens } from "lib/utils";
import { useState } from "react";

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
              amptrackSection="tx_msg_receipts_assets"
              token={token}
            />
          ))}
        </Grid>
      )}
      <Flex gap={2} mt={hasSupportedTokens ? 2 : 0}>
        {supportedTokens.length > 2 && (
          <ShowMoreButton
            setToggleShowMore={() => {
              trackUseExpand({
                action: showMore ? "collapse" : "expand",
                component: "assets",
                section: "tx_page",
              });
              setShowMore(!showMore);
            }}
            showLessText="View Less Assets"
            showMoreText="View All Assets"
            toggleShowMore={showMore}
          />
        )}
        <UnsupportedTokensModal
          amptrackSection="tx_msg_receipts_unsupported_assets"
          buttonProps={{ fontSize: "12px", mb: 0 }}
          unsupportedAssets={unsupportedTokens}
        />
      </Flex>
    </Flex>
  );
};
