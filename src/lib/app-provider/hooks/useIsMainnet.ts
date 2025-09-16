import { useCelatoneApp } from "../contexts";

export const useIsMainnet = () => {
  const {
    chainConfig: { network_type },
  } = useCelatoneApp();

  return network_type === "mainnet";
};
