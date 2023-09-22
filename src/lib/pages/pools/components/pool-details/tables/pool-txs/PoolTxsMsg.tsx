import { Flex, Text, Grid, useDisclosure, Box, Badge } from "@chakra-ui/react";

import { useTrack } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableNoBorderRow } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { Message, Option, PoolDetail, Transaction } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { PoolMsgAction, PoolMsgDetail } from "./messages";
import { PoolOtherMsgs } from "./messages/PoolOtherMsgs";

interface PoolTxsMsgProps {
  isFirstSubRow: boolean;
  msgIndex: number;
  message: Option<Message>;
  otherMsgs: { [key: string]: number };
  pool: PoolDetail;
  transaction: Transaction;
  assetInfos: AssetInfosOpt;
  templateColumns: string;
}

export const PoolTxsMsg = ({
  isFirstSubRow,
  msgIndex,
  message,
  otherMsgs,
  pool,
  transaction,
  assetInfos,
  templateColumns,
}: PoolTxsMsgProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const { trackUseExpand } = useTrack();
  const msgDetailTemplateColumns = templateColumns
    .split(" ")
    .slice(0, 3)
    .concat("1fr")
    .join(" ");
  return (
    <Box
      w="full"
      minW="min-content"
      borderBottom="1px solid"
      borderColor="gray.700"
      _hover={{ background: "gray.900" }}
      sx={{
        "&:hover .pool-msg-detail-container": {
          borderColor: "gray.700",
        },
      }}
    >
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        transition="all .25s ease-in-out"
        cursor="pointer"
        onClick={() => {
          if (message) {
            trackUseExpand({
              action: !isOpen ? "expand" : "collapse",
              component: "pool_tx_msg",
              info: { msgType: extractMsgType(message.type) },
              section: `pool_txs`,
            });
          }
          onToggle();
        }}
      >
        <TableNoBorderRow pl={2}>
          {transaction.success && message && (
            <CustomIcon
              name="chevron-down"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all .25s ease-in-out"
              color="gray.600"
            />
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {isFirstSubRow && (
            <>
              <ExplorerLink
                value={transaction.hash.toLocaleUpperCase()}
                type="tx_hash"
                showCopyOnHover
                ampCopierSection={`pool_txs-${transaction.messages.length}-tx_hash`}
              />
              {transaction.messages.length > 1 && (
                <Tooltip label="There are at least one messages within this transaction that related to this pool.">
                  <Badge variant="secondary" ml="6px">
                    {transaction.messages.length}
                  </Badge>
                </Tooltip>
              )}
            </>
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {isFirstSubRow &&
            (transaction.success ? (
              <CustomIcon name="check" color="success.main" />
            ) : (
              <CustomIcon name="close" color="error.main" />
            ))}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {message ? (
            <PoolMsgAction
              msg={message}
              pool={pool}
              assetInfos={assetInfos}
              ampCopierSection={`pool_txs-${extractMsgType(message.type)}-row`}
            />
          ) : (
            <PoolOtherMsgs otherMsgs={otherMsgs} isIbc={transaction.isIbc} />
          )}
        </TableNoBorderRow>

        <TableNoBorderRow>
          <ExplorerLink
            value={transaction.sender}
            type="user_address"
            showCopyOnHover
            ampCopierSection={`pool_txs-${transaction.messages.length}-sender`}
          />
        </TableNoBorderRow>

        <TableNoBorderRow>
          {isFirstSubRow && (
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
              ampCopierSection={`pool_txs-${extractMsgType(
                message.type
              )}-detail`}
            />
          </TableNoBorderRow>
        </Grid>
      )}
    </Box>
  );
};
