import type {
  AssetInfos,
  Message,
  Option,
  PoolData,
  Transaction,
} from "lib/types";

import { Badge, Box, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableNoBorderRow } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { PoolMsgAction, PoolMsgDetail } from "./messages";
import { PoolOtherMsgs } from "./messages/PoolOtherMsgs";

interface PoolTxsMsgProps {
  assetInfos: Option<AssetInfos>;
  isFirstSubRow: boolean;
  message: Option<Message>;
  msgIndex: number;
  otherMsgs: { [key: string]: number };
  pool: PoolData;
  templateColumns: string;
  transaction: Transaction;
}

export const PoolTxsMsg = ({
  assetInfos,
  isFirstSubRow,
  message,
  msgIndex,
  otherMsgs,
  pool,
  templateColumns,
  transaction,
}: PoolTxsMsgProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const msgDetailTemplateColumns = templateColumns
    .split(" ")
    .slice(0, 3)
    .concat("1fr")
    .join(" ");
  const hasMsgDetails = transaction.success && message;
  return (
    <Box
      className="copier-wrapper"
      _hover={{ background: "gray.900" }}
      borderBottomWidth="1px"
      borderColor="gray.700"
      minW="min-content"
      sx={{
        "&:hover .pool-msg-detail-container": {
          borderColor: "gray.700",
        },
      }}
      w="full"
    >
      <Grid
        cursor="pointer"
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
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
        <TableNoBorderRow p="0 0 0 8px">
          {hasMsgDetails && (
            <CustomIcon
              color="gray.600"
              m={0}
              name="chevron-down"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all 0.25s ease-in-out"
            />
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {isFirstSubRow && (
            <>
              <ExplorerLink
                ampCopierSection={`pool_txs-${transaction.messages.length}-tx_hash`}
                showCopyOnHover
                type="tx_hash"
                value={transaction.hash.toLocaleUpperCase()}
              />
              {transaction.messages.length > 1 && (
                <Tooltip label="There are at least one messages within this transaction that related to this pool.">
                  <Badge ml="6px" variant="primary-light">
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
              <CustomIcon color="success.main" name="check" />
            ) : (
              <CustomIcon color="error.main" name="close" />
            ))}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {message ? (
            <PoolMsgAction
              ampCopierSection={`pool_txs-${extractMsgType(message.type)}-row`}
              assetInfos={assetInfos}
              msg={message}
              pool={pool}
            />
          ) : (
            <PoolOtherMsgs isIbc={transaction.isIbc} otherMsgs={otherMsgs} />
          )}
        </TableNoBorderRow>

        <TableNoBorderRow>
          <ExplorerLink
            ampCopierSection={`pool_txs-${transaction.messages.length}-sender`}
            showCopyOnHover
            type="user_address"
            value={transaction.sender}
          />
        </TableNoBorderRow>

        <TableNoBorderRow>
          {isFirstSubRow && (
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text color="text.dark" variant="body3">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </Flex>
          )}
        </TableNoBorderRow>
      </Grid>
      {hasMsgDetails && (
        <Grid
          hidden={!isOpen}
          py={4}
          templateColumns={msgDetailTemplateColumns}
          w="full"
        >
          <TableNoBorderRow gridArea="1 / 4" py={0}>
            <PoolMsgDetail
              ampCopierSection={`pool_txs-${extractMsgType(
                message.type
              )}-detail`}
              assetInfos={assetInfos}
              blockHeight={transaction.height}
              isOpened={isOpen}
              msg={message}
              msgIndex={msgIndex}
              pool={pool}
              txHash={transaction.hash}
            />
          </TableNoBorderRow>
        </Grid>
      )}
    </Box>
  );
};
