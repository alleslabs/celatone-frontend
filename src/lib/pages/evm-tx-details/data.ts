import type Big from "big.js";
import { useMemo } from "react";

import { useAssetInfos } from "lib/services/assetService";
import { useBlockDataJsonRpc } from "lib/services/block";
import { useEvmParams } from "lib/services/evm";
import {
  useCosmosTxHashByEvmTxHash,
  useTxData,
  useTxDataJsonRpc,
} from "lib/services/tx";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option, TokenWithValue } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

export interface GasInfo {
  isEIP1559: boolean;
  txFee: TokenWithValue;
  gasPrice: TokenWithValue;
  gasUsed: Big;
  gasLimit: Big;
  // eip-1559
  baseFee: TokenWithValue;
  maxFee: TokenWithValue;
  maxPriorityFee: TokenWithValue;
}

interface EvmTxDetailsData {
  isLoading: boolean;
  cosmosTxData: Option<TxData>;
  evmTxData: Option<TxDataJsonRpc>;
  evmDenom: Option<string>;
  gasInfo: Option<GasInfo>;
}

export const useEvmTxDetailsData = (evmTxHash: string): EvmTxDetailsData => {
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: evmTxData, isLoading: isLoadingEvmTxData } =
    useTxDataJsonRpc(evmTxHash);
  const { data: cosmosTxHash } = useCosmosTxHashByEvmTxHash(evmTxHash);
  const { data: cosmosTxData, isLoading: isLoadingCosmosTxData } = useTxData(
    cosmosTxHash,
    Boolean(cosmosTxHash)
  );
  const { data: blockData } = useBlockDataJsonRpc(
    evmTxData?.tx.blockNumber.toNumber()
  );

  const evmDenom = evmParams?.params.fee_denom;

  const gasInfo = useMemo<Option<GasInfo>>(() => {
    if (!evmTxData || !blockData) return undefined;
    const txFee = coinToTokenWithValue(
      evmDenom ?? "",
      evmTxData.txReceipt.gasUsed
        .mul(evmTxData.txReceipt.effectiveGasPrice)
        .toString(),
      assetInfos
    );

    const gasPrice = coinToTokenWithValue(
      evmDenom ?? "",
      evmTxData.txReceipt.effectiveGasPrice.toString(),
      assetInfos
    );

    const baseFee = coinToTokenWithValue(
      evmDenom ?? "",
      blockData.block.baseFeePerGas.toString(),
      assetInfos
    );

    const maxFee = coinToTokenWithValue(
      evmDenom ?? "",
      evmTxData.tx.maxFeePerGas.toString(),
      assetInfos
    );

    const maxPriorityFee = coinToTokenWithValue(
      evmDenom ?? "",
      evmTxData.tx.maxPriorityFeePerGas.toString(),
      assetInfos
    );

    return {
      isEIP1559: evmTxData.tx.type === "0x2",
      txFee,
      gasPrice,
      gasUsed: evmTxData.txReceipt.gasUsed,
      gasLimit: evmTxData.tx.gas,
      baseFee,
      maxFee,
      maxPriorityFee,
    };
  }, [assetInfos, blockData, evmDenom, evmTxData]);

  return {
    isLoading:
      isLoadingEvmTxData || isLoadingCosmosTxData || isEvmParamsLoading,
    cosmosTxData,
    evmTxData,
    evmDenom,
    gasInfo,
  };
};
