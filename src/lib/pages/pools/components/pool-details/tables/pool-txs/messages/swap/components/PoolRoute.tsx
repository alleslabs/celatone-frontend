import { Flex, Text } from "@chakra-ui/react";

import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { AssetInfosOpt } from "lib/services/assetService";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";
import type { TokenWithValue } from "lib/types";
import { coinToTokenWithValue, getTokenLabel } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

interface PoolRouteProps {
  routes: MsgSwapExactAmountInDetails["routes"];
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const PoolRoute = ({ routes, assetInfos, isOpened }: PoolRouteProps) => {
  const { data: poolAssets, isLoading } = usePoolAssetsbyPoolIds(
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
            {showStepper && <AccordionStepperItem />}
            <Flex alignItems="center" w="full" my={2}>
              <PoolLogo
                tokens={tokens}
                logoSize={5}
                marginLeft={-4}
                textVariant="small"
                minW={20}
              />
              <div>
                <Flex
                  gap={1}
                  css={{
                    "p:last-of-type > span": {
                      display: "none",
                    },
                  }}
                >
                  {tokens.map((token) => (
                    <Text
                      key={token.denom}
                      variant="body2"
                      fontWeight={
                        token.denom === pool.tokenOutDenom ? 700 : 400
                      }
                      color={
                        token.denom === pool.tokenOutDenom
                          ? "honeydew.main"
                          : "text.main"
                      }
                    >
                      {token.symbol ?? getTokenLabel(token.denom)}
                      <Text as="span" fontWeight={400} color="honeydew.main">
                        {" "}
                        /
                      </Text>
                    </Text>
                  ))}
                </Flex>
                <ExplorerLink
                  type="pool_id"
                  value={pool.poolId.toString()}
                  showCopyOnHover
                />
              </div>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
