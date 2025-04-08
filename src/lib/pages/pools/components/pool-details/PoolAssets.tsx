import type Big from "big.js";
import type { PoolData, USD } from "lib/types";

import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import { big, PoolType } from "lib/types";
import { formatPrice } from "lib/utils";
import Link from "next/link";

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
      <Flex align="center" justifyContent="space-between" mb={4} mt={12}>
        <Flex align="center" gap={2}>
          <Heading as="h6" variant="h6">
            Pool assets
          </Heading>
          <Badge color="text.main" textColor="text.main" variant="gray">
            {pool.liquidity.length}
          </Badge>
        </Flex>
        {pool.isSupported && (
          <Text color="text.dark" fontWeight={500} variant="body2">
            Total liquidity:
            <Text as="span" color="text.main" fontWeight={700} ml={2}>
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
          <PoolAssetsTable pool={pool} totalLiquidity={totalLiquidity} />
          <Flex alignItems="center" gap={2} mt={4}>
            <Text color="text.dark" variant="body2">
              What is asset weight and allocation?
            </Text>
            <Link
              href="https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
              rel="noopener noreferrer"
              target="_blank"
              onClick={() =>
                trackWebsite(
                  "https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
                )
              }
            >
              <Flex alignItems="center" gap="2px">
                <Text color="primary.main" variant="body2">
                  View more
                </Text>
                <CustomIcon boxSize={3} color="primary.main" name="launch" />
              </Flex>
            </Link>
          </Flex>
        </>
      )}
    </>
  );
};
