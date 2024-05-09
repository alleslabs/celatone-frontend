import axios from "axios";

import { zDelegations } from "lib/services/types";
import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getDelegationsByAddress = async (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(`${endpoint}/${encodeURI(address)}/delegations`)
    .then(({ data }) => parseWithError(zDelegations, data));
