import { Flex, Grid } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import { ShowMoreButton } from "lib/components/button";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { TokenCard } from "lib/components/TokenCard";
import { AmpTrackExpand } from "lib/services/amplitude";
import type { AssetInfo, Option } from "lib/types";

type AssetObject = { [key: string]: AssetInfo };

interface CoinComponentProps<
  T extends Coin | Coin[],
  A extends Option<AssetObject> | AssetObject
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
          {supportedCoins.slice(0, showMore ? undefined : 2).map((coin) => {
            const assetInfo = assetInfos[coin.denom];
            return (
              <TokenCard
                key={coin.denom}
                userBalance={{
                  balance: {
                    amount: coin.amount,
                    id: assetInfo.id,
                    name: assetInfo.name,
                    precision: assetInfo.precision,
                    symbol: assetInfo.symbol,
                    type: assetInfo.type,
                    price: assetInfo.price,
                  },
                  assetInfo,
                }}
                amptrackSection="tx_msg_receipts_assets"
              />
            );
          })}
        </Grid>
      )}
      <Flex gap={2} mt={hasSupportedCoins ? 2 : 0}>
        {supportedCoins.length > 2 && (
          <ShowMoreButton
            showMoreText="View All Assets"
            showLessText="View Less Assets"
            toggleShowMore={showMore}
            setToggleShowMore={() => {
              AmpTrackExpand(
                showMore ? "collapse" : "expand",
                "assets",
                "tx_page"
              );
              setShowMore(!showMore);
            }}
          />
        )}
        {unsupportedCoins && (
          <UnsupportedTokensModal
            unsupportedAssets={unsupportedCoins.map((coin) => {
              const assetInfo = assetInfos[coin.denom];
              return {
                balance: {
                  amount: coin.amount,
                  id: coin.denom,
                  precision: 0,
                },
                assetInfo,
              };
            })}
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
}: CoinComponentProps<Coin, AssetObject>) => {
  const assetInfo = assetInfos[amount.denom];
  return assetInfo ? (
    <TokenCard
      userBalance={{
        balance: {
          amount: amount.amount,
          id: assetInfo.id,
          name: assetInfo.name,
          precision: assetInfo.precision,
          symbol: assetInfo.symbol,
          type: assetInfo.type,
          price: assetInfo.price,
        },
        assetInfo,
      }}
      amptrackSection="tx_msg_receipts_assets"
      w={{ base: "100%", md: "50%" }}
      mt={{ base: 2, md: 0 }}
    />
  ) : (
    <UnsupportedTokensModal
      unsupportedAssets={[
        {
          balance: {
            amount: amount.amount,
            id: amount.denom,
            precision: 0,
          },
          assetInfo,
        },
      ]}
      amptrackSection="tx_msg_receipts_unsupported_assets"
    />
  );
};

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
