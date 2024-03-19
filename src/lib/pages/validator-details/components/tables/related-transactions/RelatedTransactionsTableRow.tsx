import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { BigSource } from "big.js";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { TokenImageRender } from "lib/components/token";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/validator";
import type { AssetInfos, Coin, Option, USD } from "lib/types";
import {
  coinToTokenWithValue,
  dateFromNow,
  extractMsgType,
  formatPrice,
  formatUTC,
  formatUTokenWithPrecision,
} from "lib/utils";

interface RelatedTransactionsBondedTokenChangesProps {
  txHash: string;
  token: Coin;
  assetInfos: Option<AssetInfos>;
}

const RelatedTransactionsBondedTokenChanges = ({
  txHash,
  token,
  assetInfos,
}: RelatedTransactionsBondedTokenChangesProps) => {
  const tokenWithValue = coinToTokenWithValue(
    token?.denom,
    token?.amount,
    assetInfos
  );

  const formattedAmount = formatUTokenWithPrecision(
    tokenWithValue.amount,
    tokenWithValue.precision ?? 0,
    false,
    2,
    true
  );

  const isPositiveAmount = tokenWithValue.amount.gte(0);

  return (
    <Flex
      gap={2}
      key={`${txHash}-${token.denom}`}
      w="100%"
      justifyContent="end"
      alignItems="center"
    >
      <Box textAlign="right">
        <Text>
          <Text
            as="span"
            fontWeight={700}
            color={isPositiveAmount ? "success.main" : "error.main"}
          >
            {formattedAmount}
          </Text>{" "}
          {tokenWithValue.symbol}
        </Text>
        <Text variant="body3" color="text.dark">
          ({formatPrice(tokenWithValue.value?.abs() as USD<BigSource>)})
        </Text>
      </Box>
      <TokenImageRender
        boxSize={7}
        logo={
          tokenWithValue.logo ?? getUndefinedTokenIcon(tokenWithValue.denom)
        }
      />
    </Flex>
  );
};

interface RelatedTransactionsTableRowProps {
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  templateColumns: string;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionsTableRow = ({
  delegationRelatedTx,
  templateColumns,
  assetInfos,
}: RelatedTransactionsTableRowProps) => {
  return (
    <Grid
      templateColumns={templateColumns}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          value={delegationRelatedTx.txHash.toLocaleUpperCase()}
          type="tx_hash"
          showCopyOnHover
        />
        {delegationRelatedTx.messages.length > 1 && (
          <Badge variant="secondary" ml={2}>
            {delegationRelatedTx.messages.length}
          </Badge>
        )}
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={delegationRelatedTx.sender}
          type="user_address"
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <Text variant="body2" color="white">
          {delegationRelatedTx.messages.length > 1
            ? `${delegationRelatedTx.messages.length} Messages`
            : extractMsgType(delegationRelatedTx.messages[0].type)}
        </Text>
      </TableRow>
      <TableRow>
        {delegationRelatedTx.tokens.map((token) => (
          <RelatedTransactionsBondedTokenChanges
            txHash={delegationRelatedTx.txHash}
            token={token}
            assetInfos={assetInfos}
          />
        ))}
      </TableRow>
      <TableRow>
        <Box>
          <Text variant="body2" color="text.dark">
            {formatUTC(delegationRelatedTx.timestamp)}
          </Text>
          <Text variant="body3" color="text.disabled">
            {`(${dateFromNow(delegationRelatedTx.timestamp)})`}
          </Text>
        </Box>
      </TableRow>
    </Grid>
  );
};
