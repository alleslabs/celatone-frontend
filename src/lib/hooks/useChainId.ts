import { useWallet } from "@cosmos-kit/react";

export const useChainId = () => {
  const { currentChainRecord } = useWallet();
  const chainId = currentChainRecord?.chain.chain_id;
  if (!chainId) throw new Error("Chain ID not found");
  return chainId;
};
