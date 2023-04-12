import { fromBech32, toBech32 } from "@cosmjs/encoding";

import type { HumanAddr, ValidatorAddr } from "lib/types";

export const addrToValoper = (address: HumanAddr) => {
  const { prefix, data } = fromBech32(address);
  return toBech32(`${prefix}valoper`, data) as ValidatorAddr;
};
