import axios from "axios";

import { zEvmParams } from "../types/evm";
import { parseWithError } from "lib/utils";

export const getEvmParams = (endpoint: string) =>
  axios
    .get(`${endpoint}/minievm/evm/v1/params`)
    .then(({ data }) => parseWithError(zEvmParams, data));
