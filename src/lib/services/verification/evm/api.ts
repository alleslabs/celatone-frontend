import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import { zEvmVerifyConfig } from "lib/services/types";

export const getEvmVerifyConfig = async () =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/evm/verification/config`)
    .then(({ data }) => zEvmVerifyConfig.parse(data));
