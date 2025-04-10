import type { BechAddr } from "lib/types";

import axios from "axios";
import { zDelegationData } from "lib/services/types";
import { parseWithError } from "lib/utils";

export const getDelegationData = async (endpoint: string, address: BechAddr) =>
  axios
    .get(`${endpoint}/${encodeURI(address)}/delegations`)
    .then(({ data }) => parseWithError(zDelegationData, data));
