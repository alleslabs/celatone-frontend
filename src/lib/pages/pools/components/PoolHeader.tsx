import { Flex, Heading, Text, Box, Image } from "@chakra-ui/react";

import { BalancerIcon, StableswapIcon, SuperfluidIcon } from "../constant";
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
      <PoolLogo poolLiquidity={poolLiquidity} />
      <Box>
        <Flex gap={1}>
          <Flex
            gap={1}
            css={{
              "div:last-child > #separator": {
                display: "none",
              },
            }}
          >
            {poolLiquidity.slice(0, 4).map((item) => (
              <Flex key={item.denom} gap={1}>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {item.symbol || getTokenLabel(item.denom)}
                </Heading>
                <Heading
                  as="h6"
                  id="separator"
                  fontWeight="600"
                  variant="h6"
                  color="honeydew.main"
                >
                  /
                </Heading>
              </Flex>
            ))}
          </Flex>
          {poolLiquidity.length > 4 && (
            <>
              <Heading
                as="h6"
                fontWeight="600"
                variant="h6"
                color="honeydew.main"
              >
                /
              </Heading>
              <Heading as="h6" fontWeight="600" variant="h6">
                + {poolLiquidity.length - 4}
              </Heading>
            </>
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
                  src={poolType === "Balancer" ? BalancerIcon : StableswapIcon}
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
                <Image boxSize={4} src={SuperfluidIcon} />
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
