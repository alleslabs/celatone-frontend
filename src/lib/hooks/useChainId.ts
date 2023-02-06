import { useWallet } from "@cosmos-kit/react";

export const useChainId = () => {
  const { currentChainRecord } = useWallet();
  if (!currentChainRecord?.chain.chain_id)
    throw new Error("Chain ID not found");
  return currentChainRecord.chain.chain_id;
};
