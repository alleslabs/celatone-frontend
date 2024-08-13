import { Flex, Text } from "@chakra-ui/react";

import { AccordionStepperItem } from "lib/components/AccordionStepperItem";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";
import type { AssetInfos, Option, TokenWithValue } from "lib/types";
import { coinToTokenWithValue, getTokenLabel } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

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
      <Text variant="body2" textColor="gray.500" fontWeight={500}>
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
                          ? "primary.main"
                          : "text.main"
                      }
                    >
                      {getTokenLabel(token.denom, token.symbol)}
                      <Text as="span" fontWeight={400} color="primary.main">
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
                  ampCopierSection={ampCopierSection}
                />
              </div>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
