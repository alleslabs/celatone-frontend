import type { Addr, IndexedModule, Option } from "lib/types";

import { useQueryEvents } from "lib/hooks";
import {
  useModuleByAddressRest,
  useModulesByAddress,
} from "lib/services/move/module";
import { useMemo } from "react";

export const useSearchModules = ({
  address,
  moduleName,
  onError,
  onModulesSuccess,
  onModuleSuccess,
}: {
  address: Addr;
  moduleName: Option<string>;
  onError: (err: unknown) => void;
  onModulesSuccess: (modules: IndexedModule[]) => void;
  onModuleSuccess: (modules: IndexedModule) => void;
}) => {
  const moduleByAddressRestQuery = useModuleByAddressRest({
    address,
    moduleName: moduleName ?? "",
    options: {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });
  useQueryEvents(moduleByAddressRestQuery, {
    onError,
    onSuccess: onModuleSuccess,
  });
  const { isFetching: isModuleFetching, refetch: refetchModule } =
    moduleByAddressRestQuery;

  const modulesByAddressQuery = useModulesByAddress({
    address,
    enabled: false,
  });
  useQueryEvents(modulesByAddressQuery, {
    onError,
    onSuccess: ({ items }) => onModulesSuccess(items),
  });
  const { isFetching: isModulesFetching, refetch: refetchModules } =
    modulesByAddressQuery;

  const refetch = useMemo(
    () => (moduleName ? refetchModule : refetchModules),
    [moduleName, refetchModule, refetchModules]
  );

  return {
    isFetching: isModuleFetching || isModulesFetching,
    refetch,
  };
};
