import type { GridProps } from "@chakra-ui/react";
import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Grid, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { coinToTokenWithValue, formatUTokenWithPrecision } from "lib/utils";

import { TableRow } from "../tableComponents";

interface HoldersTableRowProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: string;
  holder: TokenHolder;
  rank: number;
  templateColumns: GridProps["templateColumns"];
}

export const HoldersTableRow = ({
  assetInfos,
  evmDenom,
  holder,
  rank,
  templateColumns,
}: HoldersTableRowProps) => {
  const token = coinToTokenWithValue(evmDenom, holder.amount, assetInfos);

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
      <TableRow justifyContent="flex-end">
        <Text variant="body2">
          {formatUTokenWithPrecision({
            amount: token.amount,
            decimalPoints: token.precision !== null ? 6 : 0,
            isSuffix: true,
            precision: token.precision ?? 0,
          })}
        </Text>
      </TableRow>
    </Grid>
  );
};
