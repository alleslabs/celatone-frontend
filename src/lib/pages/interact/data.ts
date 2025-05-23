import type { Addr, IndexedModule, Option } from "lib/types";

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
  const { isFetching: isModuleFetching, refetch: refetchModule } =
    useModuleByAddressRest({
      address,
      moduleName: moduleName ?? "",
      options: {
        enabled: false,
        onError,
        onSuccess: onModuleSuccess,
        refetchOnWindowFocus: false,
        retry: false,
      },
    });
  const { isFetching: isModulesFetching, refetch: refetchModules } =
    useModulesByAddress({
      address,
      enabled: false,
      onError,
      onSuccess: ({ items }) => onModulesSuccess(items),
    });

  const refetch = useMemo(
    () => (moduleName ? refetchModule : refetchModules),
    [moduleName, refetchModule, refetchModules]
  );

  return {
    isFetching: isModuleFetching || isModulesFetching,
    refetch,
  };
};
