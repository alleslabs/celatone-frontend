import { useEvmConfig, useInternalNavigate } from "lib/app-provider";

export const useTxRedirect = (txHash: string) => {
  const navigate = useInternalNavigate();
  const evm = useEvmConfig({ shouldRedirect: false });

  if (evm.enabled && txHash.startsWith("0x")) {
    navigate({ pathname: "/evm-txs/[txHash]", query: { txHash } });
    return true;
  }

  return false;
};
