import axios from "axios";

import type { MoveAccountAddr } from "lib/types";
import type {
  InternalResource,
  ResponseResource,
  ResponseResources,
} from "lib/types/move/resource";
import { snakeToCamel } from "lib/utils";

export const getAccountResources = async (
  baseEndpoint: string,
  address: MoveAccountAddr
): Promise<InternalResource[]> => {
  const result: ResponseResource[] = [];

  const fetchFn = async (paginationKey: string | null) => {
    const { data } = await axios.get<ResponseResources>(
      `${baseEndpoint}/initia/move/v1/accounts/${address}/resources${
        paginationKey ? `?pagination.key=${paginationKey}` : ""
      }`
    );
    result.push(...data.resources);
    if (data.pagination.next_key) await fetchFn(data.pagination.next_key);
  };

  await fetchFn(null);

  return snakeToCamel(result).sort((a, b) =>
    a.structTag < b.structTag ? -1 : 1
  );
};
