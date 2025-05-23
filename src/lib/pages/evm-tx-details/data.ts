import type Big from "big.js";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option, Ratio, TokenWithValue } from "lib/types";

import { useAssetInfos } from "lib/services/assetService";
import { useBlockDataJsonRpc } from "lib/services/block";
import { useEvmParams } from "lib/services/evm";
import {
  useCosmosTxHashByEvmTxHash,
  useEvmTxDataJsonRpc,
  useTxData,
} from "lib/services/tx";
import { coinToTokenWithValue } from "lib/utils";
import { useMemo } from "react";

export interface GasInfo {
  // eip-1559
  baseFee: TokenWithValue;
  gasLimit: Big;
  gasPrice: TokenWithValue;
  gasRefundRatio: Ratio<number>;
  gasUsed: Big;
  isEIP1559: boolean;
  maxFee: TokenWithValue;
  maxPriorityFee: TokenWithValue;
  txFee: TokenWithValue;
}

interface EvmTxDetailsData {
  cosmosTxData: Option<TxData>;
  evmDenom: Option<string>;
  evmTxData: Option<TxDataJsonRpc>;
  evmTxValue: Option<TokenWithValue>;
  gasInfo: Option<GasInfo>;
  isLoading: boolean;
}

export const useEvmTxDetailsData = (evmTxHash: string): EvmTxDetailsData => {
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: evmTxData, isLoading: isLoadingEvmTxData } =
    useEvmTxDataJsonRpc(evmTxHash);
  const { data: cosmosTxHash } = useCosmosTxHashByEvmTxHash(evmTxHash);
  const { data: cosmosTxData, isLoading: isLoadingCosmosTxData } = useTxData(
    cosmosTxHash,
    Boolean(cosmosTxHash)
  );
  const { data: blockData, isLoading: isLoadingBlockData } =
    useBlockDataJsonRpc(evmTxData?.tx.blockNumber.toNumber());

  const evmDenom = evmParams?.params.feeDenom;
  const gasRefundRatio =
    evmParams?.params.gasRefundRatio ?? (0 as Ratio<number>);

  const evmTxValue = useMemo<Option<TokenWithValue>>(() => {
    if (!evmTxData) return undefined;
    return coinToTokenWithValue(
      evmDenom ?? "",
      evmTxData.tx.value.toString(),
      assetInfos
    );
  }, [assetInfos, evmDenom, evmTxData]);

  const gasInfo = useMemo<Option<GasInfo>>(() => {
    if (!evmTxData || !blockData) return undefined;
    const gasRefund = evmTxData.tx.gas
      .minus(evmTxData.txReceipt.gasUsed)
      .mul(gasRefundRatio);
    const actualGasAmount = evmTxData.tx.gas.minus(gasRefund);
    const txFee = coinToTokenWithValue(
      evmDenom ?? "",
      actualGasAmount.mul(evmTxData.txReceipt.effectiveGasPrice).toString(),
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
      baseFee,
      gasLimit: evmTxData.tx.gas,
      gasPrice,
      gasRefundRatio,
      gasUsed: evmTxData.txReceipt.gasUsed,
      isEIP1559: evmTxData.tx.type === "0x2",
      maxFee,
      maxPriorityFee,
      txFee,
    };
  }, [assetInfos, blockData, evmDenom, evmTxData, gasRefundRatio]);

  return {
    cosmosTxData,
    evmDenom,
    evmTxData,
    evmTxValue,
    gasInfo,
    isLoading:
      isLoadingEvmTxData ||
      isLoadingCosmosTxData ||
      isEvmParamsLoading ||
      isLoadingBlockData,
  };
};
