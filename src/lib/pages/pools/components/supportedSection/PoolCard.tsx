import { Flex, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { Big } from "big.js";
import big from "big.js";
import Link from "next/link";

import { PoolHeader } from "../PoolHeader";
import { UnderDevAlert } from "../UnderDevAlert";
import { getPoolUrl } from "lib/app-fns/explorer";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { AmpTrackWebsite } from "lib/services/amplitude";
import type { USD, Pool, Token, U } from "lib/types";
import { formatPrice } from "lib/utils";

import { AllocationBadge } from "./AllocationBadge";

const hoverBgColor = "pebble.700";

interface PoolCardProps {
  item: Pool;
  mode: string;
}

export const PoolCard = ({ item, mode = "percent-value" }: PoolCardProps) => {
  const { currentChainName } = useWallet();
  const navigate = useInternalNavigate();
  const handleOnClick = () => {
    navigate({ pathname: `/pools/[poolId]`, query: { poolId: item.id } });
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
            backgroundColor: hoverBgColor,
          },
          backgroundColor: "pebble.800",
        },
      }}
    >
      <Flex>
        <PoolHeader
          poolId={item.id}
          isSuperfluid={item.isSuperfluid}
          poolType={item.type}
          poolLiquidity={item.poolLiquidity}
        />
        <Tooltip label="See in osmosis.zone">
          <Link
            href={`${getPoolUrl(currentChainName)}/${item.id}`}
            onClick={(e) => {
              AmpTrackWebsite(`${getPoolUrl(currentChainName)}/${item.id}`);
              e.stopPropagation();
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              fontSize="24px"
              variant="none"
              aria-label="external"
              _hover={{ backgroundColor: hoverBgColor }}
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
          {item.poolLiquidity ? formatPrice(liquidity) : "N/A"}
        </Text>
      </Flex>
      {item.poolLiquidity ? (
        <SimpleGrid columns={4} gap={2}>
          <>
            {item.poolLiquidity.slice(0, 3).map((asset) => (
              <AllocationBadge
                key={asset.denom}
                denom={asset.denom}
                logo={asset.logo}
                symbol={asset.symbol}
                precision={asset.precision}
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
                precision={
                  is4Assets ? item.poolLiquidity[3].precision : undefined
                }
                amount={
                  item.poolLiquidity
                    .slice(3)
                    .reduce(
                      (prev, asset) => prev.add(asset.amount),
                      big(0)
                    ) as U<Token<Big>>
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
      ) : (
        <UnderDevAlert poolType={item.type} />
      )}
    </Flex>
  );
};
