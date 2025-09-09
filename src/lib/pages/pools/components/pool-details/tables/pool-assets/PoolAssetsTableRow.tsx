import type { GridProps } from "@chakra-ui/react";
import type Big from "big.js";
import type { PoolData, Ratio, TokenWithValue, USD } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { Copier } from "lib/components/copy";
import { TableRow } from "lib/components/table";
import { TokenImageRender } from "lib/components/token";
import { TooltipInfo } from "lib/components/Tooltip";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import { PoolType } from "lib/types";
import {
  divWithDefault,
  formatInteger,
  formatPrice,
  formatRatio,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetsTableRowProps {
  liquidityIndex: number;
  pool: PoolData;
  templateColumns: GridProps["templateColumns"];
  token: TokenWithValue;
  totalLiquidity: USD<Big>;
}

export const PoolAssetsTableRow = ({
  liquidityIndex,
  pool: { isSupported, scalingFactors, type: poolType, weight },
  templateColumns,
  token,
  totalLiquidity,
}: PoolAssetsTableRowProps) => {
  const allocation = token.value
    ? formatRatio(divWithDefault(token.value, totalLiquidity, 0) as Ratio<Big>)
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
          _hover={{
            "& .widget": { display: "flex" },
          }}
          alignItems="center"
          gap={2}
        >
          <TokenImageRender
            boxSize={7}
            logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
          />
          <Flex flexDirection="column">
            <Flex align="center" gap={1}>
              <Text color="text.main" fontWeight={600} variant="body2">
                {getTokenLabel(token.denom, token.symbol)}
              </Text>
              <Flex className="widget" align="center" display="none" gap={1}>
                <TooltipInfo
                  className="copier"
                  label={`Token ID: ${token.denom}`}
                />
                <Copier
                  amptrackSection="pool_assets"
                  copyLabel="Token ID copied!"
                  ml={0}
                  type="token_denom"
                  value={token.denom}
                />
              </Flex>
            </Flex>
            {isSupported && token.price && (
              <Text color="text.dark" variant="body3">
                {formatPrice(token.price)}
              </Text>
            )}
          </Flex>
        </Flex>
      </TableRow>
      {poolType !== PoolType.COSMWASM && (
        <TableRow fontWeight={700} justifyContent="flex-end">
          {poolType === PoolType.STABLESWAP ? scalingFactor : tokenWeight}
        </TableRow>
      )}
      <TableRow fontWeight={700} justifyContent="flex-end">
        {isSupported && allocation}
      </TableRow>
      <TableRow justifyContent="flex-end">
        <Flex direction="column" textAlign="end">
          <Text color="text.main" fontWeight={700} variant="body2">
            {formatUTokenWithPrecision({
              amount: token.amount,
              isSuffix: false,
              precision: token.precision ?? 0,
            })}
          </Text>
          {isSupported && token.value && (
            <Text color="text.dark" variant="body3">
              ({formatPrice(token.value)})
            </Text>
          )}
        </Flex>
      </TableRow>
    </Grid>
  );
};
