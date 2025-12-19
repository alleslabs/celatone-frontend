import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { coinToTokenWithValue, formatUTokenWithPrecision } from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface HoldersTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: string;
  holder: TokenHolder;
  rank: number;
}

export const HoldersTableMobileCard = ({
  assetInfos,
  evmDenom,
  holder,
  rank,
}: HoldersTableMobileCardProps) => {
  const token = coinToTokenWithValue(evmDenom, holder.amount, assetInfos);

  return (
    <MobileCardTemplate
      bottomContent={
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
