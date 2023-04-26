import { Flex, Text } from "@chakra-ui/react";

import { PoolAssets } from "../PoolAssets";
import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";

interface PoolRouteProps {
  routes: {
    poolId: number;
    tokenOutDenom: string;
  }[];
  assetInfos: AssetInfosOpt;
}

export const PoolRoute = ({ routes, assetInfos }: PoolRouteProps) => {
  const { data: poolAssets, isLoading } = usePoolAssetsbyPoolIds(
    routes.map((pool) => pool.poolId)
  );

  if (isLoading) return <Loading />;
  if (!poolAssets)
    return (
      <EmptyState
        imageVariant="not-found"
        message="There is an error during fetching pool detail."
      />
    );
  return (
    <Flex direction="column">
      <Text variant="body2" textColor="pebble.500" fontWeight={500}>
        Pool Route
      </Text>
      {routes.map((pool) => (
        <Flex
          key={pool.poolId}
          className="accordion-stepper-wrapper"
          alignItems="center"
        >
          <AccordionStepperItem />
          <PoolAssets
            poolId={pool.poolId}
            assets={poolAssets[pool.poolId]}
            outAsset={pool.tokenOutDenom}
            assetInfos={assetInfos}
          />
        </Flex>
      ))}
    </Flex>
  );
};
