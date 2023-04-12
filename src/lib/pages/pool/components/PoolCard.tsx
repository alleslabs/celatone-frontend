import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import big, { Big } from "big.js";
import Link from "next/link";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useAssetInfos } from "lib/services/assetService";
import type { USD } from "lib/types";
import type { PoolDetail } from "lib/types/pool";
import {
  calAssetValueWithPrecision,
  formatPrice,
  getTokenLabel,
} from "lib/utils";
import { formatPercentValue } from "lib/utils/formatter/formatPercentValue";

import { PoolHeader } from "./PoolHeader";

interface PoolCardProps {
  item: PoolDetail;
  poolId: number;
  mode: string;
}
const pebble700 = "pebble.700";

export const PoolCard = ({
  item,
  poolId,
  mode = "percent-value",
}: PoolCardProps) => {
  const navigate = useInternalNavigate();
  const handleOnClick = () => {
    navigate({ pathname: `/pool/[poolId]`, query: { poolId } });
  };
  const { assetInfos } = useAssetInfos();

  if (!assetInfos)
    return (
      <Skeleton height="175px" startColor="pebble.900" endColor="pebble.800" />
    );

  const liquidity = item.poolLiquidity.reduce((total, asset) => {
    const assetInfo = assetInfos[asset.denom];
    return total.add(
      assetInfo
        ? calAssetValueWithPrecision({
            amount: asset.amount,
            id: assetInfo.id,
            price: assetInfo.price,
            precision: assetInfo.precision,
          })
        : (big(0) as USD<Big>)
    ) as USD<Big>;
  }, big(0) as USD<Big>);

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
          "> div:last-child > div": { backgroundColor: pebble700 },
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
        <Flex w="72px" justifyContent="flex-end">
          <Tooltip
            hasArrow
            label="See in osmosis.zone"
            placement="top"
            bg="honeydew.darker"
            maxW="240px"
          >
            <Link href="/">
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
          <Tooltip
            hasArrow
            label="Pin to top"
            placement="top"
            bg="honeydew.darker"
            maxW="240px"
          >
            <Flex>
              <IconButton
                fontSize="24px"
                _hover={{ backgroundColor: pebble700 }}
                variant="none"
                aria-label="save"
                color="pebble.600"
                icon={<CustomIcon name="bookmark" />}
              />
            </Flex>
          </Tooltip>
        </Flex>
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
      <Flex
        gap="2px"
        css={{
          "div:first-of-type": {
            borderRadius: "4px 0px 0px 4px",
          },
          "div:last-child": {
            borderRadius: "0px 4px 4px 0px",
          },
        }}
      >
        {item.poolLiquidity.map((asset) => (
          <Flex
            bg="pebble.800"
            px={3}
            py={1}
            w="full"
            transition="all .25s ease-in-out"
          >
            <Box>
              <Text variant="body3" color="text.dark" fontWeight="600">
                {assetInfos?.[asset.denom]?.symbol ||
                  getTokenLabel(asset.denom)}
              </Text>
              <Text variant="body3" color="text.main">
                {mode === "percent-value"
                  ? `${formatPercentValue(
                      Big(
                        calAssetValueWithPrecision({
                          amount: asset.amount,
                          id: assetInfos?.[asset.denom]?.id || "",
                          price: assetInfos?.[asset.denom]?.price,
                          precision: assetInfos?.[asset.denom]?.precision || 0,
                        })
                      )
                        .div(liquidity)
                        .times(100)
                    )}`
                  : `${asset.amount}`}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
