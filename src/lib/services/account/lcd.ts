/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

import type { AccountData } from "../types";
import type { BechAddr } from "lib/types";

export const getAccountDataLcd = async (
  endpoint: string,
  address: BechAddr
): Promise<AccountData> => {
  // TODO: Implement this function
  return {
    projectInfo: null,
    publicInfo: null,
    icns: null,
  };
};
