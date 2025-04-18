import axios from "axios";
import { zBlockDataResponse, zBlocksResponse } from "lib/services/types";
import { parseWithError } from "lib/utils";

export const getBlocks = async (
  endpoint: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zBlocksResponse, data));

export const getBlockData = async (endpoint: string, height: number) =>
  axios
    .get(`${endpoint}/${height}/info`)
    .then(({ data }) => parseWithError(zBlockDataResponse, data));
