/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

import { getIcnsNamesByAddressLcd } from "../name/lcd";
import type { AccountData } from "../types";
import type { BechAddr } from "lib/types";

export const getAccountDataLcd = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> => {
  const icns = await getIcnsNamesByAddressLcd(endpoint, address);

  // TODO: Implement this function
  return {
    projectInfo: null,
    publicInfo: null,
    icns,
  };
};
