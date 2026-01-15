import type { GridProps } from "@chakra-ui/react";
import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";

import { Grid, Stack, Text } from "@chakra-ui/react";
import Big from "big.js";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ProgressBar } from "lib/components/ProgressBar";
import { coinToTokenWithValue, formatUTokenWithPrecision } from "lib/utils";

import { TableRow } from "../tableComponents";

interface HoldersTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: string;
  holder: TokenHolder;
  rank: number;
  templateColumns: GridProps["templateColumns"];
  totalSupply: Nullable<bigint>;
  totalSupplyError: boolean;
  totalSupplyLoading: boolean;
}

export const HoldersTableRow = ({
  assetInfos,
  evmDenom,
  holder,
  rank,
  templateColumns,
  totalSupply,
  totalSupplyError,
  totalSupplyLoading,
}: HoldersTableRowProps) => {
  const token = coinToTokenWithValue(evmDenom, holder.amount, assetInfos);

  // Calculate percentage
  const percentage = totalSupply
    ? Big(holder.amount).div(totalSupply.toString()).times(100).toFixed(2)
    : null;

  // Calculate values for progress bar
  const holderAmount = Big(holder.amount);
  const totalSupplyBig = totalSupply ? Big(totalSupply.toString()) : Big(0);

  // Render percentage cell content - show percentage and progress bar, or dash
  const renderPercentageContent = () => {
    if (!totalSupply || totalSupplyLoading || totalSupplyError) {
      return <Text variant="body2">—</Text>;
    }

    return (
      <Stack spacing={2} w="full">
        <Text variant="body2">{percentage ? `${percentage}%` : "—"}</Text>
        {percentage && (
          <ProgressBar
            borderRadius={1}
            height="6px"
            max={totalSupplyBig}
            value={holderAmount}
          />
        )}
      </Stack>
    );
  };

  return (
    <Grid
      className="copier-wrapper"
      _hover={{ bg: "gray.900" }}
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow justifyContent="center">
        <Text textAlign="center" variant="body2">
          {rank}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          textFormat="normal"
          type="user_address"
          value={holder.account}
        />
      </TableRow>
      <TableRow>
        <Text variant="body2">
          {formatUTokenWithPrecision({
            amount: token.amount,
            decimalPoints: token.precision !== null ? 6 : 0,
            isSuffix: true,
            precision: token.precision ?? 0,
          })}
        </Text>
      </TableRow>
      <TableRow>{renderPercentageContent()}</TableRow>
    </Grid>
  );
};
