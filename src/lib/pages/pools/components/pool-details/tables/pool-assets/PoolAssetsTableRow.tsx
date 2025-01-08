import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { Copier } from "lib/components/copy";
import { TableRow } from "lib/components/table";
import { TokenImageRender } from "lib/components/token";
import { TooltipInfo } from "lib/components/Tooltip";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { PoolData, Ratio, TokenWithValue, USD } from "lib/types";
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
          alignItems="center"
          gap={2}
          _hover={{
            "& .widget": { display: "flex" },
          }}
        >
          <TokenImageRender
            boxSize={7}
            logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
          />
          <Flex flexDirection="column">
            <Flex align="center" gap={1}>
              <Text variant="body2" color="text.main" fontWeight={600}>
                {getTokenLabel(token.denom, token.symbol)}
              </Text>
              <Flex className="widget" align="center" display="none" gap={1}>
                <TooltipInfo
                  className="copier"
                  label={`Token ID: ${token.denom}`}
                />
                <Copier
                  ml={0}
                  type="token_denom"
                  value={token.denom}
                  amptrackSection="pool_assets"
                  copyLabel="Token ID Copied!"
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
      {poolType !== PoolType.COSMWASM && (
        <TableRow fontWeight={700} justifyContent="flex-end">
          {poolType === PoolType.STABLESWAP ? scalingFactor : tokenWeight}
        </TableRow>
      )}
      <TableRow fontWeight={700} justifyContent="flex-end">
        {isSupported && allocation}
      </TableRow>
      <TableRow justifyContent="flex-end">
        <Flex textAlign="end" direction="column">
          <Text variant="body2" color="text.main" fontWeight={700}>
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
