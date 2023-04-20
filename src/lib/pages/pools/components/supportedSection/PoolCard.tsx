import { Flex, IconButton, SimpleGrid, Text, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { Big } from "big.js";
import big from "big.js";
import Link from "next/link";

import { PoolHeader } from "../PoolHeader";
import { getPoolUrl } from "lib/app-fns/explorer";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { USD, Pool, Token, U } from "lib/types";
import { formatPrice } from "lib/utils";

import { AllocationBadge } from "./AllocationBadge";

const pebble700 = "pebble.700";

interface PoolCardProps {
  item: Pool;
  poolId: number;
  mode: string;
}

export const PoolCard = ({
  item,
  poolId,
  mode = "percent-value",
}: PoolCardProps) => {
  const { currentChainName } = useWallet();
  const navigate = useInternalNavigate();
  const handleOnClick = () => {
    navigate({ pathname: `/pools/[poolId]`, query: { poolId } });
  };

  const liquidity = item.poolLiquidity.reduce(
    (total, asset) => total.add(asset.value ?? big(0)) as USD<Big>,
    big(0) as USD<Big>
  );
  const is4Assets = item.poolLiquidity.length === 4;

  return (
    <Flex
      gap={4}
      flexDirection="column"
      onClick={handleOnClick}
      bg="pebble.900"
      borderRadius="8px"
      p={4}
      transition="all .25s ease-in-out"
      cursor="pointer"
      sx={{
        _hover: {
          "> div:last-child > div": {
            borderColor: "pebble.600",
            backgroundColor: pebble700,
          },
          backgroundColor: "pebble.800",
        },
      }}
    >
      <Flex>
        <PoolHeader
          poolId={item.id}
          isSuperFluid={item.isSuperfluid}
          poolType={item.type}
          poolLiquidity={item.poolLiquidity}
        />
        <Tooltip
          hasArrow
          label="See in osmosis.zone"
          placement="top"
          bg="honeydew.darker"
          maxW="240px"
        >
          <Link
            href={`${getPoolUrl(currentChainName)}/${item.id}`}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              fontSize="24px"
              variant="none"
              aria-label="external"
              _hover={{ backgroundColor: pebble700 }}
              color="pebble.600"
              icon={<CustomIcon name="launch" />}
            />
          </Link>
        </Tooltip>
      </Flex>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Text variant="body2" color="text.dark" fontWeight="600">
            Liquidity
          </Text>
        </Flex>
        <Text variant="body2" color="text.main">
          {formatPrice(liquidity)}
        </Text>
      </Flex>
      <SimpleGrid columns={4} gap={2}>
        <>
          {item.poolLiquidity.slice(0, 3).map((asset) => (
            <AllocationBadge
              key={asset.denom}
              denom={asset.denom}
              logo={asset.logo}
              symbol={asset.symbol}
              amount={asset.amount}
              value={asset.value}
              liquidity={liquidity}
              mode={mode}
            />
          ))}
          {item.poolLiquidity.length >= 4 && (
            <AllocationBadge
              key="OTHERS"
              denom={is4Assets ? item.poolLiquidity[3].denom : undefined}
              logo={is4Assets ? item.poolLiquidity[3].logo : undefined}
              symbol={is4Assets ? item.poolLiquidity[3].symbol : undefined}
              amount={
                item.poolLiquidity
                  .slice(3)
                  .reduce((prev, asset) => prev.add(asset.amount), big(0)) as U<
                  Token<Big>
                >
              }
              value={
                item.poolLiquidity
                  .slice(3)
                  .reduce(
                    (prev, asset) => prev.add(asset.value ?? big(0)),
                    big(0)
                  ) as USD<Big>
              }
              liquidity={liquidity}
              mode={mode}
            />
          )}
        </>
      </SimpleGrid>
    </Flex>
  );
};
