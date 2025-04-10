import type { AssetInfos, Option, TokenWithValue } from "lib/types";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

import { Flex, Text } from "@chakra-ui/react";
import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { usePoolsLiquidityByPoolIds } from "lib/services/pools";
import { coinToTokenWithValue, getTokenLabel } from "lib/utils";

interface PoolRouteProps {
  routes: MsgSwapExactAmountInDetails["routes"];
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const PoolRoute = ({
  routes,
  assetInfos,
  isOpened,
  ampCopierSection,
}: PoolRouteProps) => {
  const { data: poolAssets, isLoading } = usePoolsLiquidityByPoolIds(
    routes.map((pool) => pool.poolId),
    isOpened
  );
  const showStepper = routes.length > 1;

  if (isLoading) return <Loading />;
  if (!poolAssets)
    return (
      <EmptyState message="There is an error during fetching pool detail." />
    );
  return (
    <Flex direction="column">
      <Text fontWeight={500} textColor="gray.500" variant="body2">
        Pool Route
      </Text>
      {routes.map((pool) => {
        const tokens = poolAssets[pool.poolId].map<TokenWithValue>((denom) =>
          coinToTokenWithValue(denom, "0", assetInfos)
        );
        return (
          <Flex
            key={pool.poolId}
            className="accordion-stepper-wrapper"
            alignItems="center"
          >
            {showStepper && <AccordionStepperItem />}
            <Flex alignItems="center" my={2} w="full">
              <PoolLogo
                logoSize={5}
                marginLeft={-4}
                minW={20}
                textVariant="small"
                tokens={tokens}
              />
              <div>
                <Flex
                  css={{
                    "p:last-of-type > span": {
                      display: "none",
                    },
                  }}
                  gap={1}
                >
                  {tokens.map((token) => (
                    <Text
                      key={token.denom}
                      color={
                        token.denom === pool.tokenOutDenom
                          ? "primary.main"
                          : "text.main"
                      }
                      fontWeight={
                        token.denom === pool.tokenOutDenom ? 700 : 400
                      }
                      variant="body2"
                    >
                      {getTokenLabel(token.denom, token.symbol)}
                      <Text as="span" color="primary.main" fontWeight={400}>
                        {" "}
                        /
                      </Text>
                    </Text>
                  ))}
                </Flex>
                <ExplorerLink
                  ampCopierSection={ampCopierSection}
                  showCopyOnHover
                  type="pool_id"
                  value={pool.poolId.toString()}
                />
              </div>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
