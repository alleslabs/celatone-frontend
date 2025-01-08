import { Flex, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import type Big from "big.js";
import Link from "next/link";

import { PoolHeader } from "../PoolHeader";
import { trackWebsite } from "lib/amplitude";
import { useInternalNavigate, usePoolConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Tooltip } from "lib/components/Tooltip";
import { big } from "lib/types";
import type { Pool, Token, U, USD } from "lib/types";
import { formatPrice } from "lib/utils";

import { AllocationBadge } from "./AllocationBadge";

const hoverBgColor = "gray.700";

interface PoolCardProps {
  item: Pool;
  mode: string;
}

export const PoolCard = ({ item, mode = "percent-value" }: PoolCardProps) => {
  const navigate = useInternalNavigate();
  const poolConfig = usePoolConfig({ shouldRedirect: true });
  // Remark: the empty string has never been used when poolConfig is disabled
  const poolUrl = poolConfig.enabled ? poolConfig.url : "";

  const liquidity = item.liquidity.reduce(
    (total, asset) => total.add(asset.value ?? big(0)) as USD<Big>,
    big(0) as USD<Big>
  );

  const is4Assets = item.liquidity.length === 4;

  return (
    <Flex
      bg="gray.900"
      gap={4}
      p={4}
      sx={{
        _hover: {
          "> div:last-child > div": {
            backgroundColor: hoverBgColor,
            borderColor: "gray.600",
          },
          backgroundColor: "gray.800",
        },
      }}
      borderRadius="8px"
      cursor="pointer"
      flexDirection="column"
      justifyContent="space-between"
      onClick={() =>
        navigate({ pathname: `/pools/[poolId]`, query: { poolId: item.id } })
      }
      transition="all 0.25s ease-in-out"
    >
      <Flex>
        <PoolHeader
          isSuperfluid={item.isSuperfluid}
          liquidity={item.liquidity}
          poolId={item.id}
          poolType={item.type}
        />
        <Tooltip label="See in osmosis.zone">
          <Link
            rel="noopener noreferrer"
            target="_blank"
            onClick={(e) => {
              trackWebsite(`${poolUrl}/${item.id}`);
              e.stopPropagation();
            }}
            href={`${poolUrl}/${item.id}`}
          >
            <IconButton
              aria-label="external"
              variant="none"
              _hover={{ backgroundColor: hoverBgColor }}
              color="gray.600"
              fontSize="24px"
              icon={<CustomIcon name="launch" />}
            />
          </Link>
        </Tooltip>
      </Flex>
      <Flex justifyContent="space-between">
        <LabelText
          label="Liquidity"
          tooltipText="The total amount of asset liquidity provided in the pool."
        />

        <Text variant="body2" color="text.main">
          {item.liquidity.some((coin) => !coin.amount)
            ? "N/A"
            : formatPrice(liquidity)}
        </Text>
      </Flex>
      <SimpleGrid gap={2} columns={4}>
        {item.liquidity.slice(0, 3).map((asset) => (
          <AllocationBadge
            key={asset.denom}
            liquidity={liquidity}
            value={asset.value}
            amount={asset.amount}
            denom={asset.denom}
            logo={asset.logo as string}
            mode={mode}
            precision={asset.precision}
            symbol={asset.symbol}
          />
        ))}
        {item.liquidity.length >= 4 && (
          <AllocationBadge
            key="OTHERS"
            liquidity={liquidity}
            value={
              item.liquidity
                .slice(3)
                .reduce(
                  (prev, asset) => prev.add(asset.value ?? big(0)),
                  big(0)
                ) as USD<Big>
            }
            amount={
              item.liquidity
                .slice(3)
                .reduce((prev, asset) => prev.add(asset.amount), big(0)) as U<
                Token<Big>
              >
            }
            denom={is4Assets ? item.liquidity[3].denom : undefined}
            logo={is4Assets ? (item.liquidity[3].logo as string) : undefined}
            mode={mode}
            precision={is4Assets ? item.liquidity[3].precision : undefined}
            symbol={is4Assets ? item.liquidity[3].symbol : undefined}
          />
        )}
      </SimpleGrid>
    </Flex>
  );
};
