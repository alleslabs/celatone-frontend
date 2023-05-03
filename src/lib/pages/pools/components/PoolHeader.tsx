import { Flex, Heading, Text, Box, Image } from "@chakra-ui/react";

import { BALANCER_ICON, STABLESWAP_ICON, SUPERFLUID_ICON } from "../constant";
import type { PoolDetail } from "lib/types/pool";
import { getTokenLabel } from "lib/utils";

import { PoolLogo } from "./PoolLogo";

interface PoolHeaderProps {
  poolId: PoolDetail["id"];
  isSuperFluid: PoolDetail["isSuperfluid"];
  poolType: PoolDetail["type"];
  poolLiquidity: PoolDetail["poolLiquidity"];
}

export const PoolHeader = ({
  poolId,
  isSuperFluid,
  poolType,
  poolLiquidity,
}: PoolHeaderProps) => (
  <Flex justifyContent="space-between" w="full">
    <Flex alignItems="center" gap={4}>
      <PoolLogo tokens={poolLiquidity} />
      <Box>
        <Flex gap={1} flexWrap="wrap">
          <Heading as="h6" fontWeight="600" variant="h6">
            {poolLiquidity[0].symbol ?? getTokenLabel(poolLiquidity[0].denom)}
          </Heading>
          {poolLiquidity.slice(1, 3).map((item) => (
            <Flex key={item.denom} gap={1}>
              <Heading
                as="h6"
                id="separator"
                fontWeight="600"
                variant="h6"
                color="honeydew.main"
              >
                /
              </Heading>
              <Heading as="h6" fontWeight="600" variant="h6">
                {item.symbol ?? getTokenLabel(item.denom)}
              </Heading>
            </Flex>
          ))}
          {poolLiquidity.length >= 4 && (
            <Flex gap={1}>
              <Heading
                as="h6"
                fontWeight="600"
                variant="h6"
                color="honeydew.main"
              >
                /
              </Heading>
              <Heading as="h6" fontWeight="600" variant="h6">
                {poolLiquidity.length === 4
                  ? poolLiquidity[3].symbol ??
                    getTokenLabel(poolLiquidity[3].denom)
                  : `+${poolLiquidity.length - 3}`}
              </Heading>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Text variant="body2" color="lilac.main">
            #{poolId}
          </Text>
          {poolType && (
            <Flex alignItems="center" gap={2}>
              <Flex
                backgroundColor="pebble.600"
                borderRadius="full"
                w="6px"
                h="6px"
              />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src={
                    poolType === "Balancer" ? BALANCER_ICON : STABLESWAP_ICON
                  }
                />
                <Text variant="body2" color="text.dark">
                  {poolType === "Balancer"
                    ? "Balancer Pool"
                    : "StableSwap Pool"}
                </Text>
              </Flex>
            </Flex>
          )}
          {isSuperFluid && (
            <Flex alignItems="center" gap={2}>
              <Flex
                backgroundColor="pebble.600"
                borderRadius="full"
                w="6px"
                h="6px"
              />
              <Flex alignItems="center" gap={1}>
                <Image boxSize={4} src={SUPERFLUID_ICON} />
                <Text variant="body2" color="text.dark">
                  Superfluid
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  </Flex>
);
