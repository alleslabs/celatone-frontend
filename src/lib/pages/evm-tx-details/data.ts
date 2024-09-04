import { useCosmosTxHashByEvmTxHash, useTxData } from "lib/services/tx";

export const useCosmosTxDataByEvmTxHash = (evmTxHash: string) => {
  const { data: cosmosTxHash } = useCosmosTxHashByEvmTxHash(evmTxHash);

  return useTxData(cosmosTxHash, Boolean(cosmosTxHash));
};
