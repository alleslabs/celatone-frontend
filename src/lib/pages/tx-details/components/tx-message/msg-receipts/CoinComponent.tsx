import { Flex, Grid } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { isUndefined } from "lodash";
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
  const isMobile = useMobile();
  const [showMore, setShowMore] = useState(false);

  const tokens = amount.map((coin) =>
    coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
  );
  const [supportedTokens, unsupportedTokens] = [
    tokens.filter((token) => !isUndefined(token.price)),
    tokens.filter((token) => isUndefined(token.price)),
  ];
  const hasSupportedTokens = supportedTokens.length > 0;

  return (
    <Flex direction="column" w="full">
      {hasSupportedTokens && (
        <Grid gridGap={4} gridTemplateColumns={isMobile ? "1fr " : "1fr 1fr"}>
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
        {unsupportedTokens && (
          <UnsupportedTokensModal
            unsupportedAssets={unsupportedTokens}
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
  const token = coinToTokenWithValue(amount.denom, amount.amount, assetInfos);
  return token.price === undefined ? (
    <TokenCard
      token={token}
      amptrackSection="tx_msg_receipts_assets"
      w={{ base: "100%", md: "50%" }}
      mt={{ base: 2, md: 0 }}
    />
  ) : (
    <UnsupportedTokensModal
      unsupportedAssets={[token]}
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
