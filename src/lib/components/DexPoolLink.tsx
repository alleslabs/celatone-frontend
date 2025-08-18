import { Flex, HStack } from "@chakra-ui/react";
import { useAssetInfos } from "lib/services/assetService";
import { useMoveDexPoolInfo } from "lib/services/move/dex";
import { coinToTokenWithValue, getTokenLabel } from "lib/utils";

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

  if (!moveDexPool) return <TokenImageRender boxSize={4} logo={undefined} />;

  return (
    <HStack>
      <Flex align="center" minW={4}>
        {underlyingCoins?.length === 0 ? (
          <TokenImageRender boxSize={4} logo={lpToken?.logo} />
        ) : (
          underlyingCoins?.map((token) => (
            <Flex key={token.denom} align="center" marginInlineEnd="-4px">
              <TokenImageRender
                alt={getTokenLabel(token.denom, token.symbol)}
                boxSize={4}
                logo={token.logo}
              />
            </Flex>
          ))
        )}
      </Flex>
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
