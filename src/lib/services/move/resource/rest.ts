import axios from "axios";

import { zResourcesResponseRest } from "lib/services/types";
import type {
  ResourceResponse,
  ResourceResponseItem,
} from "lib/services/types";
import type { Addr, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getAccountResourcesRest = async (
  endpoint: string,
  address: Addr
): Promise<ResourceResponse> => {
  const result: ResourceResponseItem[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/initia/move/v1/accounts/${encodeURI(address)}/resources`,
        {
          params: {
            "pagination.key": paginationKey,
          },
        }
      )
      .then(({ data }) => parseWithError(zResourcesResponseRest, data));
    result.push(...res.resources);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    items: result.sort((a, b) => a.structTag.localeCompare(b.structTag)),
    total: result.length,
  };
};
