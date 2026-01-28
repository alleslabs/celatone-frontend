import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import Big from "big.js";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { coinToTokenWithValue, formatUTokenWithPrecision } from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface HoldersTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: string;
  holder: TokenHolder;
  rank: number;
  totalSupply: Nullable<bigint>;
  totalSupplyError: boolean;
  totalSupplyLoading: boolean;
}

export const HoldersTableMobileCard = ({
  assetInfos,
  evmDenom,
  holder,
  rank,
  totalSupply,
  totalSupplyError,
  totalSupplyLoading,
}: HoldersTableMobileCardProps) => {
  const token = coinToTokenWithValue(evmDenom, holder.amount, assetInfos);

  // Calculate percentage
  const percentage = totalSupply
    ? Big(holder.amount).div(totalSupply.toString()).times(100).toFixed(2)
    : null;

  // Render percentage value - show percentage or dash
  const renderPercentageValue = () => {
    if (!totalSupply || totalSupplyLoading || totalSupplyError) {
      return <Text variant="body2">—</Text>;
    }

    return <Text variant="body2">{percentage ? `${percentage}%` : "—"}</Text>;
  };

  return (
    <MobileCardTemplate
      bottomContent={
        <Grid gap={3} templateColumns="1fr 1fr" w="full">
          <Flex direction="column">
            <MobileLabel label="Quantity" />
            <Text variant="body2">
              {formatUTokenWithPrecision({
                amount: token.amount,
                decimalPoints: token.precision !== null ? 6 : 0,
                isSuffix: true,
                precision: token.precision ?? 0,
              })}
            </Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Percentage" />
            {renderPercentageValue()}
          </Flex>
        </Grid>
      }
      topContent={
        <Grid gap={3} templateColumns="64px 1fr" w="full">
          <Flex direction="column">
            <MobileLabel label="Rank" />
            <Text variant="body2">{rank}</Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Holder Address" />
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={holder.account}
            />
          </Flex>
        </Grid>
      }
    />
  );
};
