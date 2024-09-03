import { Grid, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxDataJsonRpc } from "lib/services/types";
import { getEvmMethod } from "lib/utils";

interface EvmTxDetailProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxDetailBody = ({ evmTxData }: EvmTxDetailProps) => {
  const method = getEvmMethod(evmTxData.tx.input);

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (method) {
    // TODO: Implement the following cases in the next PR
    // case "transfer":
    //   return <Text>Transfer</Text>;
    // case "transfer ERC20":
    //   return <Text>Transfer ERC20</Text>;
    // case "create":
    //   return <Text>Create</Text>;
    default:
      return (
        <>
          <Heading as="h6" variant="h6">
            Sender / Receiver
          </Heading>
          <Grid templateColumns="180px 3fr">
            <Text fontWeight={500} variant="body2">
              From:
            </Text>
            <ExplorerLink type="user_address" value={evmTxData.tx.from} />
          </Grid>
          <Grid templateColumns="180px 3fr">
            <Text fontWeight={500} variant="body2">
              To:
            </Text>
            {evmTxData.txReceipt.to ? (
              <ExplorerLink
                type="user_address"
                value={evmTxData.txReceipt.to}
              />
            ) : (
              <Text>-</Text>
            )}
          </Grid>
        </>
      );
  }
};
