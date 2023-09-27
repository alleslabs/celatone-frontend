import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { MoveAccountAddr } from "lib/types";
import type { InternalResource } from "lib/types/move/resource";

import { getAccountResources } from "./resource";

export interface IndexedResource extends InternalResource {
  address: string;
  move_resource: string;
  raw_bytes: string;
  struct_tag: string;
}

// const indexResourceResponse = (resource: InternalResource): IndexedResource => {
//   const parsedAbi = parseJsonABI(module.abi);
//   const { view, execute } = splitViewExecuteFunctions(
//     parsedAbi.exposed_functions
//   );
//   return {
//     ...module,
//     parsedAbi,
//     viewFunctions: view,
//     executeFunctions: execute,
//     searchedFn: parsedAbi.exposed_functions.find(
//       (fn) => fn.name === functionName
//     ),
//   };
// };

export const useAccountResources = ({
  address,
}: {
  address: MoveAccountAddr;
}): UseQueryResult<IndexedResource[]> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<InternalResource[]> = () =>
    getAccountResources(baseEndpoint, address);
  return useQuery(
    [CELATONE_QUERY_KEYS.RESOURCE_MODULES, baseEndpoint, address],
    queryFn
  );
};
