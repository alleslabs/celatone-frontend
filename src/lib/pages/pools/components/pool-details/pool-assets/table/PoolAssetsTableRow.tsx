import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Image, Text } from "@chakra-ui/react";
import type { Big } from "big.js";

import { Copier } from "lib/components/copy";
import { TableRow } from "lib/components/table/tableComponents";
import { TooltipInfo } from "lib/components/Tooltip";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { USD, PoolDetail, TokenWithValue, Ratio } from "lib/types";
import {
  formatInteger,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
  formatRatio,
} from "lib/utils";

interface PoolAssetsTableRowProps {
  pool: PoolDetail<Big, TokenWithValue>;
  token: TokenWithValue;
  templateColumns: GridProps["templateColumns"];
  totalLiquidity: USD<Big>;
  liquidityIndex: number;
}

export const PoolAssetsTableRow = ({
  pool: { type: poolType, weight, scalingFactors, isSupported },
  token,
  templateColumns,
  totalLiquidity,
  liquidityIndex,
}: PoolAssetsTableRowProps) => {
  const allocation = token.value
    ? formatRatio(token.value.div(totalLiquidity) as Ratio<Big>)
    : undefined;
  const tokenWeight = weight?.find(
    (w) => w.denom === token.denom
  )?.percentWeight;
  const scalingFactor = scalingFactors
    ? formatInteger(scalingFactors[liquidityIndex])
    : undefined;
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <Flex
          alignItems="center"
          gap={2}
          _hover={{
            "& .widget": { display: "flex" },
          }}
        >
          <Image
            boxSize={7}
            src={token.logo ?? getUndefinedTokenIcon(token.denom)}
          />
          <Flex flexDirection="column">
            <Flex align="center" gap={1}>
              <Text variant="body2" fontWeight={600} color="text.main">
                {token.symbol ?? getTokenLabel(token.denom)}
              </Text>
              <Flex className="widget" display="none" align="center" gap={1}>
                <TooltipInfo
                  label={`Token ID: ${token.denom}`}
                  iconVariant="solid"
                  className="copier"
                />
                <Copier
                  type="token_denom"
                  value={token.denom}
                  copyLabel="Token ID Copied!"
                  ml={0}
                />
              </Flex>
            </Flex>
            {isSupported && token.price && (
              <Text variant="body3" color="text.dark">
                {formatPrice(token.price)}
              </Text>
            )}
          </Flex>
        </Flex>
      </TableRow>
      <TableRow fontWeight={700} justifyContent="flex-end">
        {poolType === "Stableswap" ? scalingFactor : tokenWeight}
      </TableRow>
      <TableRow fontWeight={700} justifyContent="flex-end">
        {isSupported && allocation}
      </TableRow>
      <TableRow justifyContent="flex-end">
        <Flex direction="column" textAlign="end">
          <Text variant="body2" fontWeight={700} color="text.main">
            {formatUTokenWithPrecision(
              token.amount,
              token.precision ?? 0,
              false
            )}
          </Text>
          {isSupported && token.value && (
            <Text variant="body3" color="text.dark">
              ({formatPrice(token.value)})
            </Text>
          )}
        </Flex>
      </TableRow>
    </Grid>
  );
};
