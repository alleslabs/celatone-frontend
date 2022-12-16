import { useApp } from "../contexts";
import type { CelatoneConstants, CelatoneContractAddress } from "types";

export const useCelatoneApp = () => {
  return useApp<CelatoneContractAddress, CelatoneConstants>();
};
