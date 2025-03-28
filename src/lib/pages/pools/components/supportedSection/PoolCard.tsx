import { Flex, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import type Big from "big.js";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { useInternalNavigate, usePoolConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Tooltip } from "lib/components/Tooltip";
import { big } from "lib/types";
import type { Pool, Token, U, USD } from "lib/types";
import { formatPrice } from "lib/utils";

import { AllocationBadge } from "./AllocationBadge";
import { PoolHeader } from "../PoolHeader";

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
      justifyContent="space-between"
      gap={4}
      flexDirection="column"
      onClick={() =>
        navigate({ pathname: `/pools/[poolId]`, query: { poolId: item.id } })
      }
      bg="gray.900"
      borderRadius="8px"
      p={4}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      sx={{
        _hover: {
          "> div:last-child > div": {
            borderColor: "gray.600",
            backgroundColor: hoverBgColor,
          },
          backgroundColor: "gray.800",
        },
      }}
    >
      <Flex>
        <PoolHeader
          poolId={item.id}
          isSuperfluid={item.isSuperfluid}
          poolType={item.type}
          liquidity={item.liquidity}
        />
        <Tooltip label="See in osmosis.zone">
          <Link
            href={`${poolUrl}/${item.id}`}
            onClick={(e) => {
              trackWebsite(`${poolUrl}/${item.id}`);
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
              color="gray.600"
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
      <SimpleGrid columns={4} gap={2}>
        {item.liquidity.slice(0, 3).map((asset) => (
          <AllocationBadge
            key={asset.denom}
            denom={asset.denom}
            logo={asset.logo as string}
            symbol={asset.symbol}
            precision={asset.precision}
            amount={asset.amount}
            value={asset.value}
            liquidity={liquidity}
            mode={mode}
          />
        ))}
        {item.liquidity.length >= 4 && (
          <AllocationBadge
            key="OTHERS"
            denom={is4Assets ? item.liquidity[3].denom : undefined}
            logo={is4Assets ? (item.liquidity[3].logo as string) : undefined}
            symbol={is4Assets ? item.liquidity[3].symbol : undefined}
            precision={is4Assets ? item.liquidity[3].precision : undefined}
            amount={
              item.liquidity
                .slice(3)
                .reduce((prev, asset) => prev.add(asset.amount), big(0)) as U<
                Token<Big>
              >
            }
            value={
              item.liquidity
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
      </SimpleGrid>
    </Flex>
  );
};
