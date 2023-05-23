import { useCelatoneApp } from "../contexts";

export const useChainId = () => {
  const { currentChainId } = useCelatoneApp();
  if (!currentChainId) throw new Error("Chain ID not found");

  return currentChainId;
};
