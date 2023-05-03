import { Flex, Text, Grid, useDisclosure, Box, Badge } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableNoBorderRow } from "lib/components/table";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { Addr, Message } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { PoolTxsAction, PoolTxsDetail } from "./messages";

interface PoolTxsTableRowProps {
  isFirstRow: boolean;
  txHash: string;
  success: boolean;
  msgCount: number;
  message: Message;
  sender: Addr;
  created: Date;
  msgIndex: number;
  blockHeight: number;
  assetInfos: AssetInfosOpt;
  templateColumns: string;
}

export const PoolTxsTableRow = ({
  isFirstRow,
  txHash,
  success,
  msgCount,
  message,
  sender,
  created,
  msgIndex,
  blockHeight,
  assetInfos,
  templateColumns,
}: PoolTxsTableRowProps) => {
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
    >
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        onClick={onToggle}
        transition="all .25s ease-in-out"
        cursor="pointer"
      >
        <TableNoBorderRow>
          {isFirstRow && (
            <Flex>
              <ExplorerLink
                value={txHash.toLocaleUpperCase()}
                type="tx_hash"
                showCopyOnHover
              />
              {msgCount > 1 && (
                <Badge variant="lilac" ml="6px">
                  {msgCount}
                </Badge>
              )}
            </Flex>
          )}
        </TableNoBorderRow>
        <TableNoBorderRow>
          {isFirstRow &&
            (success ? (
              <CustomIcon name="check" color="success.main" />
            ) : (
              <CustomIcon name="close" color="error.main" />
            ))}
        </TableNoBorderRow>
        <TableNoBorderRow>
          <PoolTxsAction msg={message} assetInfos={assetInfos} />
        </TableNoBorderRow>

        <TableNoBorderRow>
          <ExplorerLink value={sender} type="user_address" showCopyOnHover />
        </TableNoBorderRow>

        <TableNoBorderRow>
          {isFirstRow && (
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(created)})`}
              </Text>
            </Flex>
          )}
        </TableNoBorderRow>

        {success && (
          <TableNoBorderRow>
            <CustomIcon name={isOpen ? "chevron-up" : "chevron-down"} />
          </TableNoBorderRow>
        )}
      </Grid>
      {success && (
        <Grid
          w="full"
          py={4}
          hidden={!isOpen}
          templateColumns={msgDetailTemplateColumns}
        >
          <TableNoBorderRow py={0} />
          <TableNoBorderRow py={0} />
          <TableNoBorderRow py={0}>
            <PoolTxsDetail
              txHash={txHash}
              blockHeight={blockHeight}
              msgIndex={msgIndex}
              msg={message}
              assetInfos={assetInfos}
            />
          </TableNoBorderRow>
        </Grid>
      )}
    </Box>
  );
};
