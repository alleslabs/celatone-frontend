import axios from "axios";

import {
  zCommissionsResponseRest,
  zDelegationRewardsResponseRest,
} from "lib/services/types";
import type { BechAddr, ValidatorAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getDelegationRewardsByAddressRest = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/delegators/${encodeURI(address)}/rewards`
    )
    .then(({ data }) => parseWithError(zDelegationRewardsResponseRest, data));

export const getCommissionsByValidatorAddressRest = (
  endpoint: string,
  valAddr: ValidatorAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/validators/${encodeURI(valAddr)}/commission`
    )
    .then(
      ({ data }) => parseWithError(zCommissionsResponseRest, data).commission
    );
