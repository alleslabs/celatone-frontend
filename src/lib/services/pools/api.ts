import axios from "axios";

import {
  zPoolDataResponse,
  zPoolsLiquidityResponse,
  zPoolsResponse,
} from "../types";
import type { PoolTypeFilter } from "lib/types";
import { parseWithError } from "lib/utils";

export const getPools = async (
  endpoint: string,
  limit: number,
  offset: number,
  isSupported: boolean,
  type: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  isDesc: boolean
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_supported: isSupported,
        type,
        is_superfluid_only: isSuperfluidOnly,
        search,
        is_desc: isDesc,
      },
    })
    .then(({ data }) => parseWithError(zPoolsResponse, data));

export const getPoolData = async (endpoint: string, id: number) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(id)}`)
    .then(({ data }) => parseWithError(zPoolDataResponse, data));

export const getPoolsLiquidityByPoolIds = async (
  endpoint: string,
  ids: number[]
) =>
  axios
    .get(`${endpoint}/liquidity`, {
      params: {
        pool_ids: ids.join(","),
      },
    })
    .then(({ data }) => parseWithError(zPoolsLiquidityResponse, data));
