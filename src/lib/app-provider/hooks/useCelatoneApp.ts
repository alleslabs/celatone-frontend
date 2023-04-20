import { useApp } from "../contexts";
import type {
  CelatoneConstants,
  CelatoneContractAddress,
  CelatoneHumanAddress,
} from "types";

export const useCelatoneApp = () => {
  return useApp<
    CelatoneContractAddress,
    CelatoneHumanAddress,
    CelatoneConstants
  >();
};
