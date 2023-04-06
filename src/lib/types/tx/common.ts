import type { StdFee } from "@cosmjs/stargate";

export interface Fee extends Omit<StdFee, "gas"> {
  gas_limit: string;
}
