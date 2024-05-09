import axios from "axios";

import {
  zCommissionResponse,
  zDelegationRewardsResponse,
} from "lib/services/types";
import type { Addr, ValidatorAddr } from "lib/types";

export const getDelegationRewards = (endpoint: string, address: Addr) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/delegators/${encodeURI(address)}/rewards`
    )
    .then(({ data }) => zDelegationRewardsResponse.parse(data));

export const getCommission = (endpoint: string, valAddr: ValidatorAddr) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/validators/${encodeURI(valAddr)}/commission`
    )
    .then(({ data }) => zCommissionResponse.parse(data));
