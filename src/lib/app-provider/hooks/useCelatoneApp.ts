import { useApp } from "../contexts";
import type { CelatoneConstants } from "types";

export const useCelatoneApp = () => {
  return useApp<CelatoneConstants>();
};
