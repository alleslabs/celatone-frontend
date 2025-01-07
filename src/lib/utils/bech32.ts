import { fromBech32, toBech32 } from "@cosmjs/encoding";

import type { BechAddr20, ValidatorAddr } from "lib/types";

export const addrToValoper = (address: BechAddr20) => {
  const { data, prefix } = fromBech32(address);
  return toBech32(`${prefix}valoper`, data) as ValidatorAddr;
};

export const valoperToAddr = (valAddress: ValidatorAddr) => {
  const { data, prefix } = fromBech32(valAddress);
  return toBech32(`${prefix.slice(0, -7)}`, data) as BechAddr20;
};
