import type { TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

import { useAssetInfos } from "lib/services/assetService";
import { EvmMethodName } from "lib/types";
import { getEvmMethod } from "lib/utils";

import {
  EvmTxCallErc20Factory,
  EvmTxCreateContract,
  EvmTxDefault,
  EvmTxTransfer,
  EvmTxTransferErc20,
} from "./evm-tx-method";

interface EvmTxMsgDetailsBodyProps {
  evmDenom: Option<string>;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxMsgDetailsBody = ({
  evmDenom,
  evmTxData,
}: EvmTxMsgDetailsBodyProps) => {
  const method = getEvmMethod(evmTxData.tx.input, evmTxData.tx.to);
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  switch (method) {
    case EvmMethodName.CallErc20Factory:
      return <EvmTxCallErc20Factory evmTxData={evmTxData} />;
    case EvmMethodName.Create:
      return <EvmTxCreateContract evmTxData={evmTxData} />;
    case EvmMethodName.Transfer:
      return (
        <EvmTxTransfer
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          evmTxData={evmTxData}
        />
      );
    case EvmMethodName.TransferErc20:
      return (
        <EvmTxTransferErc20 assetInfos={assetInfos} evmTxData={evmTxData} />
      );
    default:
      return <EvmTxDefault evmTxData={evmTxData} />;
  }
};
