import { Flex, Text } from "@chakra-ui/react";

import { PoolAssets } from "../PoolAssets";
import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";
import type { TokenWithValue } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

interface PoolRouteProps {
  routes: {
    poolId: number;
    tokenOutDenom: string;
  }[];
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const PoolRoute = ({ routes, assetInfos, isOpened }: PoolRouteProps) => {
  const { data: poolAssets, isLoading } = usePoolAssetsbyPoolIds(
    routes.map((pool) => pool.poolId),
    isOpened
  );

  if (isLoading) return <Loading />;
  if (!poolAssets)
    return (
      <EmptyState message="There is an error during fetching pool detail." />
    );
  return (
    <Flex direction="column">
      <Text variant="body2" textColor="pebble.500" fontWeight={500}>
        Pool Route
      </Text>
      {routes.map((pool) => {
        const tokens = poolAssets[pool.poolId].map<TokenWithValue>((denom) =>
          coinToTokenWithValue(denom, "0", assetInfos?.[denom])
        );
        return (
          <Flex
            key={pool.poolId}
            className="accordion-stepper-wrapper"
            alignItems="center"
          >
            <AccordionStepperItem />
            <PoolAssets
              poolId={pool.poolId}
              tokens={tokens}
              outAsset={pool.tokenOutDenom}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
