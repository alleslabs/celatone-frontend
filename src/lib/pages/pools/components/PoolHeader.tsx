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
        icon: <BalancerPoolIcon boxSize={4} />,
        text: "Balancer Pool",
      };
    case PoolType.CL:
      return {
        icon: <ClpIcon boxSize={4} />,
        text: "Concentrated Liquidity Pool",
      };
    case PoolType.COSMWASM:
      return {
        icon: <CosmWasmPoolIcon boxSize={4} />,
        text: "CosmWasm Pool",
      };
    case PoolType.STABLESWAP:
      return {
        icon: <StableSwapIcon boxSize={4} />,
        text: "StableSwap Pool",
      };
    default:
      return {};
  }
};

export const PoolHeader = ({
  isSuperfluid,
  liquidity,
  poolId,
  poolType,
}: PoolHeaderProps) => {
  const poolValue = poolTypeRender(poolType);
  return (
    <Flex w="full" justifyContent="space-between">
      <Flex alignItems="center" gap={4}>
        <PoolLogo tokens={liquidity} />
        <div>
          <Flex flexWrap="wrap" gap={1}>
            <Heading as="h6" variant="h6" fontWeight="600">
              {getTokenLabel(liquidity[0].denom, liquidity[0].symbol)}
            </Heading>
            {liquidity.slice(1, 3).map((item) => (
              <Flex key={item.denom} gap={1}>
                <Heading
                  id="separator"
                  as="h6"
                  variant="h6"
                  color="primary.main"
                  fontWeight="600"
                >
                  /
                </Heading>
                <Heading as="h6" variant="h6" fontWeight="600">
                  {getTokenLabel(item.denom, item.symbol)}
                </Heading>
              </Flex>
            ))}
            {liquidity.length >= 4 && (
              <Flex gap={1}>
                <Heading
                  as="h6"
                  variant="h6"
                  color="primary.main"
                  fontWeight="600"
                >
                  /
                </Heading>
                <Heading as="h6" variant="h6" fontWeight="600">
                  {liquidity.length === 4
                    ? getTokenLabel(liquidity[3].denom, liquidity[3].symbol)
                    : `+${liquidity.length - 3}`}
                </Heading>
              </Flex>
            )}
          </Flex>
          <Flex alignItems="center" flexWrap="wrap" mt={1} columnGap={2}>
            <Text variant="body2" color="primary.main">
              #{poolId}
            </Text>
            {poolType && (
              <Flex alignItems="center" gap={1}>
                <Flex
                  h="6px"
                  w="6px"
                  backgroundColor="gray.600"
                  borderRadius="full"
                />
                <Flex alignItems="center">
                  {poolValue.icon}
                  <Text ml={1} variant="body2" color="text.dark">
                    {poolValue.text}
                  </Text>
                </Flex>
              </Flex>
            )}
            {isSuperfluid && (
              <Flex alignItems="center" gap={2}>
                <Flex
                  h="6px"
                  w="6px"
                  backgroundColor="gray.600"
                  borderRadius="full"
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
