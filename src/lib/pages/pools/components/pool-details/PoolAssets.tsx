import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { PoolData, USD } from "lib/types";
import { big, PoolType } from "lib/types";
import { formatPrice } from "lib/utils";

import { PoolAssetsTable } from "./tables/pool-assets";

interface PoolAssetsProps {
  pool: PoolData;
}

export const PoolAssets = ({ pool }: PoolAssetsProps) => {
  const totalLiquidity = pool.liquidity.reduce(
    (totalVal, token) => totalVal.add(token.value ?? 0),
    big(0)
  ) as USD<Big>;

  return (
    <>
      <Flex mt={12} mb={4} justifyContent="space-between" align="center">
        <Flex gap={2} align="center">
          <Heading as="h6" variant="h6">
            Pool Assets
          </Heading>
          <Badge variant="gray" color="text.main" textColor="text.main">
            {pool.liquidity.length}
          </Badge>
        </Flex>
        {pool.isSupported && (
          <Text variant="body2" color="text.dark" fontWeight={500}>
            Total Liquidity:
            <Text as="span" fontWeight={700} color="text.main" ml={2}>
              {pool.liquidity ? formatPrice(totalLiquidity) : "N/A"}
            </Text>
          </Text>
        )}
      </Flex>
      {pool.type === PoolType.CL ? (
        <EmptyState
          imageVariant="empty"
          heading="Coming soon!"
          message={
            "Asset allocation and liquidity information for \n concentrated liquidity pool are under construction."
          }
          withBorder
        />
      ) : (
        <>
          <PoolAssetsTable pool={pool} totalLiquidity={totalLiquidity} />
          <Flex gap={2} alignItems="center" mt={4}>
            <Text variant="body2" color="text.dark">
              What is asset weight and allocation?
            </Text>
            <Link
              href="https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWebsite(
                  "https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
                )
              }
            >
              <Flex gap="2px" alignItems="center">
                <Text color="primary.main" variant="body2">
                  View more
                </Text>
                <CustomIcon name="launch" color="primary.main" boxSize={3} />
              </Flex>
            </Link>
          </Flex>
        </>
      )}
    </>
  );
};
