import type { PoolTypeFilter } from "lib/types";

import axios from "axios";
import { parseWithError } from "lib/utils";

import {
  zPoolDataResponse,
  zPoolsLiquidityResponse,
  zPoolsResponse,
} from "../types";

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
        is_desc: isDesc,
        is_superfluid_only: isSuperfluidOnly,
        is_supported: isSupported,
        limit,
        offset,
        search,
        type,
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
