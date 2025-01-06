import { useCelatoneApp } from "../contexts";

export const useLcdEndpoint = () => {
  const { chainConfig } = useCelatoneApp();
  return chainConfig.lcd;
};
