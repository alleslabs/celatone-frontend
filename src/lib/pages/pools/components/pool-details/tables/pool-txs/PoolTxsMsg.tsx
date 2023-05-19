import { Flex, Text, Grid, useDisclosure, Box, Badge } from "@chakra-ui/react";
import type Big from "big.js";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableNoBorderRow } from "lib/components/table";
import type { AssetInfosOpt } from "lib/services/assetService";
import type {
  Message,
  PoolDetail,
  TokenWithValue,
  Transaction,
} from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { PoolMsgAction, PoolMsgDetail } from "./messages";
import { PoolOtherMsgs } from "./messages/PoolOtherMsgs";

interface PoolTxsMsgProps {
  msgIndex: number;
  message?: Message;
  otherMsgs: { [key: string]: number };
  pool: PoolDetail<Big, TokenWithValue>;
  transaction: Transaction;
  assetInfos: AssetInfosOpt;
  templateColumns: string;
}

export const PoolTxsMsg = ({
  msgIndex,
  message,
  otherMsgs,
  pool,
  transaction,
  assetInfos,
  templateColumns,
}: PoolTxsMsgProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const msgDetailTemplateColumns = templateColumns
    .split(" ")
    .slice(0, 2)
    .concat("1fr")
    .join(" ");

  return (
    <Box
      w="full"
      minW="min-content"
      borderY="0.5px solid"
      borderColor="pebble.700"
      _hover={{ background: "pebble.900" }}
      sx={{
        "&:hover .pool-msg-detail-container": {
          borderColor: "pebble.700",
        },
      }}
    >
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        onClick={onToggle}
        transition="all .25s ease-in-out"
        cursor="pointer"
      >
        <TableNoBorderRow pl={2}>
          {transaction.success && message && (
            <CustomIcon
              name="chevron-down"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all .25s ease-in-out"
            />
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {msgIndex === 0 && (
            <>
              <ExplorerLink
                value={transaction.hash.toLocaleUpperCase()}
                type="tx_hash"
                showCopyOnHover
              />
              {transaction.messages.length > 1 && (
                <Badge variant="lilac" ml="6px">
                  {transaction.messages.length}
                </Badge>
              )}
            </>
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {msgIndex === 0 &&
            (transaction.success ? (
              <CustomIcon name="check" color="success.main" />
            ) : (
              <CustomIcon name="close" color="error.main" />
            ))}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {message ? (
            <PoolMsgAction msg={message} pool={pool} assetInfos={assetInfos} />
          ) : (
            <PoolOtherMsgs otherMsgs={otherMsgs} />
          )}
        </TableNoBorderRow>

        <TableNoBorderRow>
          <ExplorerLink
            value={transaction.sender}
            type="user_address"
            showCopyOnHover
          />
        </TableNoBorderRow>

        <TableNoBorderRow>
          {msgIndex === 0 && (
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </Flex>
          )}
        </TableNoBorderRow>
      </Grid>
      {transaction.success && message && (
        <Grid
          w="full"
          py={4}
          hidden={!isOpen}
          templateColumns={msgDetailTemplateColumns}
        >
          <TableNoBorderRow py={0} />
          <TableNoBorderRow py={0} />
          <TableNoBorderRow py={0}>
            <PoolMsgDetail
              txHash={transaction.hash}
              blockHeight={transaction.height}
              msgIndex={msgIndex}
              msg={message}
              pool={pool}
              assetInfos={assetInfos}
              isOpened={isOpen}
            />
          </TableNoBorderRow>
        </Grid>
      )}
    </Box>
  );
};
