import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { Copier } from "lib/components/copy";
import { TableRow } from "lib/components/table";
import { TokenImageRender } from "lib/components/token";
import { TooltipInfo } from "lib/components/Tooltip";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { PoolDetail, Ratio, TokenWithValue, USD } from "lib/types";
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
  pool: PoolDetail;
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
              <Text variant="body2" fontWeight={600} color="text.main">
                {getTokenLabel(token.denom, token.symbol)}
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
                  amptrackSection="pool_assets"
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
