import { useCurrentChain } from "./useCurrentChain";

export const useIsConnected = () => {
  const { address } = useCurrentChain();
  return !!address;
};
