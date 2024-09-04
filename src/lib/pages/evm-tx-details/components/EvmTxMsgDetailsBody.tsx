import { Grid, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { useAssetInfos } from "lib/services/assetService";
import type { TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";
import { getEvmMethod } from "lib/utils";

import {
  EvmTxCreateContract,
  EvmTxTransfer,
  EvmTxTransferErc20,
} from "./evm-tx-method";

interface EvmTxMsgDetailsBodyProps {
  evmTxData: TxDataJsonRpc;
  evmDenom: Option<string>;
}

export const EvmTxMsgDetailsBody = ({
  evmTxData,
  evmDenom,
}: EvmTxMsgDetailsBodyProps) => {
  const method = getEvmMethod(evmTxData.tx.input);
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  switch (method) {
    case "transfer":
      return (
        <EvmTxTransfer
          evmTxData={evmTxData}
          evmDenom={evmDenom}
          assetInfos={assetInfos}
        />
      );
    case "transfer ERC20":
      return (
        <EvmTxTransferErc20 evmTxData={evmTxData} assetInfos={assetInfos} />
      );
    case "create":
      return <EvmTxCreateContract evmTxData={evmTxData} />;
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
            <ExplorerLink
              type="user_address"
              value={evmTxData.tx.from}
              showCopyOnHover
            />
          </Grid>
          <Grid templateColumns="180px 3fr">
            <Text fontWeight={500} variant="body2">
              To:
            </Text>
            {evmTxData.txReceipt.to ? (
              <ExplorerLink
                type="user_address"
                value={evmTxData.txReceipt.to}
                showCopyOnHover
              />
            ) : (
              <Text variant="body2" color="text.disabled">
                -
              </Text>
            )}
          </Grid>
        </>
      );
  }
};
