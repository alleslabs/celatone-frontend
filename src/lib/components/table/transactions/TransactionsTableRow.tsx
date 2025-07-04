import type { TransactionWithTxResponse } from "lib/types";

import { Badge, Box, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { DecodeMessage } from "lib/components/decode-message";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useTxDecoder } from "lib/services/tx";
import { dateFromNow, formatUTC } from "lib/utils";

import { AccordionTx } from "../AccordionTx";
import { TableRow } from "../tableComponents";
import { FurtherActionButton } from "./FurtherActionButton";
import { RelationChip } from "./RelationChip";

interface TransactionsTableRowProps {
  showAction: boolean;
  showRelations: boolean;
  showSuccess: boolean;
  showTimestamp: boolean;
  templateColumns: string;
  transaction: TransactionWithTxResponse;
}

const NARow = () => (
  <TableRow>
    <Text color="gray.600">N/A</Text>
  </TableRow>
);

export const TransactionsTableRow = ({
  showAction,
  showRelations,
  showSuccess,
  showTimestamp,
  templateColumns,
  transaction,
}: TransactionsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const isAccordion = transaction.messages.length > 1;
  const isTxHasNoData = transaction.height === 0;
  const { rawTxResponse, txResponse } = transaction;
  const { data: decodedTx } = useTxDecoder(rawTxResponse);

  return (
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ background: "gray.900" }}
        cursor={isAccordion ? "pointer" : "default"}
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
        onClick={isAccordion ? onToggle : undefined}
      >
        <TableRow pl={2}>
          {isAccordion && (
            <CustomIcon
              color="gray.600"
              name="chevron-down"
              transform={isOpen ? "rotate(0)" : "rotate(-90deg)"}
              transition="all 0.25s ease-in-out"
            />
          )}
        </TableRow>
        <TableRow pr={1}>
          <ExplorerLink
            showCopyOnHover
            type="tx_hash"
            value={transaction.hash.toLocaleUpperCase()}
          />
          {transaction.messages.length > 1 && (
            <Badge ml={2} variant="primary-light">
              {transaction.messages.length}
            </Badge>
          )}
        </TableRow>
        {showSuccess &&
          (isTxHasNoData ? (
            <NARow />
          ) : (
            <TableRow>
              {transaction.success ? (
                <CustomIcon color="success.main" name="check" />
              ) : (
                <CustomIcon color="error.main" name="close" />
              )}
            </TableRow>
          ))}
        {isTxHasNoData || !decodedTx ? (
          <TableRow>
            <Text color="gray.600">
              Unable to load data due to large transaction size
            </Text>
          </TableRow>
        ) : (
          <TableRow>
            {txResponse ? (
              <DecodeMessage
                compact
                decodedMessage={decodedTx.messages[0].decodedMessage}
                isSingleMsg
                log={undefined}
                metadata={decodedTx.metadata}
                msgBody={txResponse.tx.body.messages[0]}
              />
            ) : (
              <ActionMessages transaction={transaction} />
            )}
          </TableRow>
        )}
        {showRelations &&
          (isTxHasNoData ? (
            <NARow />
          ) : (
            <TableRow>
              <RelationChip isSigner={transaction.isSigner} />
            </TableRow>
          ))}
        {isTxHasNoData ? (
          <NARow />
        ) : (
          <TableRow>
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={transaction.sender}
            />
          </TableRow>
        )}
        {showTimestamp && (
          <>
            {transaction.created && !isTxHasNoData ? (
              <TableRow>
                <Flex direction="column" gap={1}>
                  <Text variant="body3">{formatUTC(transaction.created)}</Text>
                  <Text color="text.dark" variant="body3">
                    {`(${dateFromNow(transaction.created)})`}
                  </Text>
                </Flex>
              </TableRow>
            ) : (
              <NARow />
            )}
          </>
        )}
        {showAction && (
          <TableRow>
            <FurtherActionButton transaction={transaction} />
          </TableRow>
        )}
      </Grid>
      {isAccordion && (
        <Grid hidden={!isOpen} py={4} w="full">
          {transaction.messages.map((msg, index) => (
            <AccordionTx
              key={index.toString() + msg.type}
              allowFurtherAction={showAction}
              isSigner={transaction.isSigner}
              message={msg}
              msgIndex={index}
              txHash={transaction.hash}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
