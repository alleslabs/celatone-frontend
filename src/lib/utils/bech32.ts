import { fromBech32, toBech32 } from "@cosmjs/encoding";

import type { BechAddr20, ValidatorAddr } from "lib/types";

export const addrToValoper = (address: BechAddr20) => {
  const { prefix, data } = fromBech32(address);
  return toBech32(`${prefix}valoper`, data) as ValidatorAddr;
};
