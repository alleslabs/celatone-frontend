import { Flex, Heading, Image, Text } from "@chakra-ui/react";

import {
  BALANCER_ICON,
  CLP_ICON,
  COSMWASM_ICON,
  STABLESWAP_ICON,
  SUPERFLUID_ICON,
} from "../constant";
import type { PoolDetail } from "lib/types/pool";
import { PoolType } from "lib/types/pool";
import { getTokenLabel } from "lib/utils";

import { PoolLogo } from "./PoolLogo";

interface PoolHeaderProps
  extends Pick<PoolDetail, "isSuperfluid" | "poolLiquidity"> {
  poolId: PoolDetail["id"];
  poolType: PoolDetail["type"];
}

const poolTypeRender = (type: PoolDetail["type"]) => {
  switch (type) {
    case PoolType.BALANCER:
      return {
        text: "Balancer Pool",
        icon: BALANCER_ICON,
      };
    case PoolType.STABLESWAP:
      return {
        text: "StableSwap Pool",
        icon: STABLESWAP_ICON,
      };
    case PoolType.COSMWASM:
      return {
        text: "CosmWasm Pool",
        icon: COSMWASM_ICON,
      };
    case PoolType.CL:
      return {
        text: "Concentrated Liquidity Pool",
        icon: CLP_ICON,
      };
    default:
      return {};
  }
};

export const PoolHeader = ({
  poolId,
  isSuperfluid,
  poolType,
  poolLiquidity,
}: PoolHeaderProps) => {
  const poolValue = poolTypeRender(poolType);
  return (
    <Flex justifyContent="space-between" w="full">
      <Flex alignItems="center" gap={4}>
        <PoolLogo tokens={poolLiquidity} />
        <div>
          <Flex gap={1} flexWrap="wrap">
            <Heading as="h6" fontWeight="600" variant="h6">
              {getTokenLabel(poolLiquidity[0].denom, poolLiquidity[0].symbol)}
            </Heading>
            {poolLiquidity.slice(1, 3).map((item) => (
              <Flex key={item.denom} gap={1}>
                <Heading
                  as="h6"
                  id="separator"
                  fontWeight="600"
                  variant="h6"
                  color="accent.main"
                >
                  /
                </Heading>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {getTokenLabel(item.denom, item.symbol)}
                </Heading>
              </Flex>
            ))}
            {poolLiquidity.length >= 4 && (
              <Flex gap={1}>
                <Heading
                  as="h6"
                  fontWeight="600"
                  variant="h6"
                  color="accent.main"
                >
                  /
                </Heading>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {poolLiquidity.length === 4
                    ? getTokenLabel(
                        poolLiquidity[3].denom,
                        poolLiquidity[3].symbol
                      )
                    : `+${poolLiquidity.length - 3}`}
                </Heading>
              </Flex>
            )}
          </Flex>
          <Flex alignItems="center" columnGap={2} flexWrap="wrap" mt={1}>
            <Text variant="body2" color="secondary.main">
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
                  <Image boxSize={4} src={poolValue.icon} mr={1} />
                  <Text variant="body2" color="text.dark">
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
                <Flex alignItems="center" gap={1}>
                  <Image boxSize={4} src={SUPERFLUID_ICON} />
                  <Text variant="body2" color="#ee64e8">
                    Superfluid
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
};
