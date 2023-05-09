import { Flex, Heading, Text, Image } from "@chakra-ui/react";
import type Big from "big.js";

import { DotSeparator } from "lib/components/DotSeperator";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, TokenWithValue } from "lib/types";
import { getTokenLabel } from "lib/utils";

import { PoolLogo } from "./PoolLogo";

interface PoolHeaderProps {
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}

export const PoolHeader = ({ pool, assetInfos }: PoolHeaderProps) => {
  const { poolLiquidity, id: poolId, type: poolType, isSuperfluid } = pool;
  return (
    <Flex alignItems="center" gap={2}>
      <PoolLogo poolLiquidity={poolLiquidity} assetInfos={assetInfos} />
      <Flex direction="column">
        <Flex
          gap={2}
          sx={{
            "h6:last-of-type > span": {
              display: "none",
            },
          }}
        >
          {poolLiquidity.slice(0, 4).map((item) => (
            <Heading as="h6" fontWeight="600" variant="h6" key={item.denom}>
              {assetInfos?.[item.denom]?.symbol ?? getTokenLabel(item.denom)}
              <Text as="span" ml={2} color="honeydew.main">
                /
              </Text>
            </Heading>
          ))}
          {poolLiquidity.length > 4 && (
            <Heading as="h6" fontWeight="600" variant="h6">
              <Text as="span" mr={2} color="honeydew.main">
                /
              </Text>
              + {poolLiquidity.length - 4}
            </Heading>
          )}
        </Flex>
        <Flex alignItems="center" gap={2} mt={1}>
          <Text variant="body2" color="lilac.main">
            #{poolId}
          </Text>
          {poolType && (
            <Flex alignItems="center" gap={2}>
              <DotSeparator />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src={
                    poolType === "Balancer"
                      ? "https://assets.alleslabs.dev/webapp-assets/pool/pool-balancer.svg"
                      : "https://assets.alleslabs.dev/webapp-assets/pool/pool-stableswap.svg"
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
          {isSuperfluid && (
            <Flex alignItems="center" gap={2}>
              <DotSeparator />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src="https://assets.alleslabs.dev/webapp-assets/pool/pool-superfluid.svg"
                />
                <Text variant="body2" color="text.dark">
                  Superfluid
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
