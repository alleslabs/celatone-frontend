import { Flex, Heading, Text } from "@chakra-ui/react";

import {
  BalancerPoolIcon,
  ClpIcon,
  CosmWasmPoolIcon,
  StableSwapIcon,
} from "lib/icon";
import type { PoolData } from "lib/types/pool";
import { PoolType } from "lib/types/pool";
import { getTokenLabel } from "lib/utils";

import { PoolLogo } from "./PoolLogo";
import { SuperfluidLabel } from "./SuperfluidLabel";

interface PoolHeaderProps extends Pick<PoolData, "isSuperfluid" | "liquidity"> {
  poolId: PoolData["id"];
  poolType: PoolData["type"];
}

const poolTypeRender = (type: PoolData["type"]) => {
  switch (type) {
    case PoolType.BALANCER:
      return {
        text: "Balancer pool",
        icon: <BalancerPoolIcon boxSize={4} />,
      };
    case PoolType.STABLESWAP:
      return {
        text: "StableSwap pool",
        icon: <StableSwapIcon boxSize={4} />,
      };
    case PoolType.COSMWASM:
      return {
        text: "CosmWasm pool",
        icon: <CosmWasmPoolIcon boxSize={4} />,
      };
    case PoolType.CL:
      return {
        text: "Concentrated liquidity pool",
        icon: <ClpIcon boxSize={4} />,
      };
    default:
      return {};
  }
};

export const PoolHeader = ({
  poolId,
  isSuperfluid,
  poolType,
  liquidity,
}: PoolHeaderProps) => {
  const poolValue = poolTypeRender(poolType);
  return (
    <Flex justifyContent="space-between" w="full">
      <Flex alignItems="center" gap={4}>
        <PoolLogo tokens={liquidity} />
        <div>
          <Flex gap={1} flexWrap="wrap">
            <Heading as="h6" fontWeight="600" variant="h6">
              {getTokenLabel(liquidity[0].denom, liquidity[0].symbol)}
            </Heading>
            {liquidity.slice(1, 3).map((item) => (
              <Flex key={item.denom} gap={1}>
                <Heading
                  as="h6"
                  id="separator"
                  fontWeight="600"
                  variant="h6"
                  color="primary.main"
                >
                  /
                </Heading>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {getTokenLabel(item.denom, item.symbol)}
                </Heading>
              </Flex>
            ))}
            {liquidity.length >= 4 && (
              <Flex gap={1}>
                <Heading
                  as="h6"
                  fontWeight="600"
                  variant="h6"
                  color="primary.main"
                >
                  /
                </Heading>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {liquidity.length === 4
                    ? getTokenLabel(liquidity[3].denom, liquidity[3].symbol)
                    : `+${liquidity.length - 3}`}
                </Heading>
              </Flex>
            )}
          </Flex>
          <Flex alignItems="center" columnGap={2} flexWrap="wrap" mt={1}>
            <Text variant="body2" color="primary.main">
              #{poolId}
            </Text>
            {poolType && (
              <Flex alignItems="center" gap={1}>
                <Flex
                  backgroundColor="gray.600"
                  borderRadius="full"
                  w="6px"
                  h="6px"
                />
                <Flex alignItems="center">
                  {poolValue.icon}
                  <Text variant="body2" color="text.dark" ml={1}>
                    {poolValue.text}
                  </Text>
                </Flex>
              </Flex>
            )}
            {isSuperfluid && (
              <Flex alignItems="center" gap={2}>
                <Flex
                  backgroundColor="gray.600"
                  borderRadius="full"
                  w="6px"
                  h="6px"
                />
                <SuperfluidLabel />
              </Flex>
            )}
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
};
