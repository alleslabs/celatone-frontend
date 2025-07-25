import type { TransactionWithTxResponse } from "lib/types";

import {
  Box,
  Flex,
  Grid,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
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
  const { data: decodedTx, isFetching: isDecodedTxFetching } =
    useTxDecoder(rawTxResponse);

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
        <TableRow gap={1}>
          {showSuccess && (
            <>
              {transaction.success ? (
                <CustomIcon
                  boxSize={3}
                  color="success.main"
                  name="check-circle-solid"
                />
              ) : (
                <CustomIcon
                  boxSize={3}
                  color="error.main"
                  name="close-circle-solid"
                />
              )}
            </>
          )}
          <ExplorerLink
            showCopyOnHover
            type="tx_hash"
            value={transaction.hash.toLocaleUpperCase()}
          />
        </TableRow>
        {isTxHasNoData ? (
          <TableRow>
            {isDecodedTxFetching ? (
              <Spinner boxSize={4} />
            ) : (
              <Text color="gray.600">
                Unable to load data due to large transaction size
              </Text>
            )}
          </TableRow>
        ) : (
          <TableRow maxW="100%">
            {txResponse && decodedTx ? (
              <DecodeMessage
                compact
                decodedMessage={decodedTx.messages[0].decodedMessage}
                log={undefined}
                metadata={decodedTx.metadata}
                msgBody={txResponse.tx.body.messages[0]}
                msgCount={txResponse.tx.body.messages.length}
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
              decodedMessage={decodedTx?.messages?.[index]?.decodedMessage}
              message={msg}
              metadata={decodedTx?.metadata}
              msgCount={transaction.messages.length}
              msgIndex={index}
              txHash={transaction.hash}
              txResponse={txResponse}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
