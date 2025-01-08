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
      <Flex align="center" mb={4} mt={12} justifyContent="space-between">
        <Flex align="center" gap={2}>
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
            <Text as="span" ml={2} color="text.main" fontWeight={700}>
              {pool.liquidity ? formatPrice(totalLiquidity) : "N/A"}
            </Text>
          </Text>
        )}
      </Flex>
      {pool.type === PoolType.CL ? (
        <EmptyState
          heading="Coming soon!"
          imageVariant="empty"
          message={
            "Asset allocation and liquidity information for \n concentrated liquidity pool are under construction."
          }
          withBorder
        />
      ) : (
        <>
          <PoolAssetsTable totalLiquidity={totalLiquidity} pool={pool} />
          <Flex alignItems="center" gap={2} mt={4}>
            <Text variant="body2" color="text.dark">
              What is asset weight and allocation?
            </Text>
            <Link
              rel="noopener noreferrer"
              target="_blank"
              onClick={() =>
                trackWebsite(
                  "https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
                )
              }
              href="https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
            >
              <Flex alignItems="center" gap="2px">
                <Text variant="body2" color="primary.main">
                  View more
                </Text>
                <CustomIcon name="launch" boxSize={3} color="primary.main" />
              </Flex>
            </Link>
          </Flex>
        </>
      )}
    </>
  );
};
