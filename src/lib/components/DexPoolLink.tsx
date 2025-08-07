import { HStack } from "@chakra-ui/react";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { useAssetInfos } from "lib/services/assetService";
import { useMoveDexPoolInfo } from "lib/services/move/dex";
import { coinToTokenWithValue } from "lib/utils";

import { ExplorerLink } from "./ExplorerLink";
import { TokenImageRender } from "./token/TokenImageRender";

interface DexPoolLinkProps {
  liquidityDenom: string;
}

export const DexPoolLink = ({ liquidityDenom }: DexPoolLinkProps) => {
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const { data: moveDexPool } = useMoveDexPoolInfo(liquidityDenom);

  const lpToken = assetInfos?.[liquidityDenom];

  const underlyingCoins = moveDexPool?.coins?.map((coin) =>
    coinToTokenWithValue(coin.denom, "0", assetInfos)
  );

  if (!moveDexPool || !underlyingCoins) return "No pool found";

  return (
    <HStack>
      {underlyingCoins.length === 0 ? (
        <TokenImageRender boxSize={4} logo={lpToken?.logo} />
      ) : (
        <PoolLogo
          backOver={true}
          logoSize={4}
          marginLeft={-6}
          minW="auto"
          tokens={underlyingCoins}
        />
      )}
      <ExplorerLink
        copyValue={liquidityDenom}
        externalLink={`https://app.initia.xyz/liquidity/${encodeURIComponent(liquidityDenom)}`}
        hideCopy={true}
        type="move_dex_pool_address"
        value={lpToken?.name || liquidityDenom}
      />
    </HStack>
  );
};
