import { useAssetInfos } from "lib/services/assetService";
import type { TxDataJsonRpc } from "lib/services/types";
import { EvmMethodName } from "lib/types";
import type { Option } from "lib/types";
import { getEvmMethod } from "lib/utils";

import {
  EvmTxCallErc20Factory,
  EvmTxCreateContract,
  EvmTxDefault,
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
    case EvmMethodName.Transfer:
      return (
        <EvmTxTransfer
          evmTxData={evmTxData}
          evmDenom={evmDenom}
          assetInfos={assetInfos}
        />
      );
    case EvmMethodName.TransferErc20:
      return (
        <EvmTxTransferErc20 evmTxData={evmTxData} assetInfos={assetInfos} />
      );
    case EvmMethodName.Create:
      return <EvmTxCreateContract evmTxData={evmTxData} />;
    case EvmMethodName.CallErc20Factory:
      return <EvmTxCallErc20Factory evmTxData={evmTxData} />;
    default:
      return <EvmTxDefault evmTxData={evmTxData} />;
  }
};
