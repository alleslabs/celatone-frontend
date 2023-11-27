import { Flex, Grid } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useState } from "react";

import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { ShowMoreButton } from "lib/components/button";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { TokenCard } from "lib/components/token/TokenCard";
import type { AssetInfo, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

type AssetObject = { [key: string]: AssetInfo };

interface CoinComponentProps<
  T extends Coin | Coin[],
  A extends Option<AssetObject> | AssetObject,
> {
  amount: T;
  assetInfos: A;
}

const MultiCoin = ({
  amount,
  assetInfos,
}: CoinComponentProps<Coin[], AssetObject>) => {
  const [supportedCoins, unsupportedCoins] = [
    amount.filter((coin) => Boolean(assetInfos[coin.denom])),
    amount.filter((coin) => !assetInfos[coin.denom]),
  ];
  const [showMore, setShowMore] = useState(false);

  const hasSupportedCoins = supportedCoins.length > 0;
  const isMobile = useMobile();
  return (
    <Flex direction="column" w="full">
      {hasSupportedCoins && (
        <Grid gridGap={4} gridTemplateColumns={isMobile ? "1fr " : "1fr 1fr"}>
          {supportedCoins.slice(0, showMore ? undefined : 2).map((coin) => (
            <TokenCard
              key={coin.denom}
              token={coinToTokenWithValue(coin.denom, coin.amount, assetInfos)}
              amptrackSection="tx_msg_receipts_assets"
            />
          ))}
        </Grid>
      )}
      <Flex gap={2} mt={hasSupportedCoins ? 2 : 0}>
        {supportedCoins.length > 2 && (
          <ShowMoreButton
            showMoreText="View All Assets"
            showLessText="View Less Assets"
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
        {unsupportedCoins && (
          <UnsupportedTokensModal
            unsupportedAssets={unsupportedCoins}
            buttonProps={{ fontSize: "12px", mb: 0 }}
            amptrackSection="tx_msg_receipts_unsupported_assets"
          />
        )}
      </Flex>
    </Flex>
  );
};

const SingleCoin = ({
  amount,
  assetInfos,
}: CoinComponentProps<Coin, AssetObject>) =>
  assetInfos[amount.denom] ? (
    <TokenCard
      token={coinToTokenWithValue(amount.denom, amount.amount, assetInfos)}
      amptrackSection="tx_msg_receipts_assets"
      w={{ base: "100%", md: "50%" }}
      mt={{ base: 2, md: 0 }}
    />
  ) : (
    <UnsupportedTokensModal
      unsupportedAssets={[amount]}
      amptrackSection="tx_msg_receipts_unsupported_assets"
    />
  );

export const CoinComponent = ({
  amount,
  assetInfos,
}: CoinComponentProps<Coin | Coin[], Option<AssetObject>>) => {
  if (!assetInfos || (Array.isArray(amount) && !amount.length))
    return <>{JSON.stringify(amount)}</>;
  return Array.isArray(amount) ? (
    <MultiCoin amount={amount} assetInfos={assetInfos} />
  ) : (
    <SingleCoin amount={amount} assetInfos={assetInfos} />
  );
};
