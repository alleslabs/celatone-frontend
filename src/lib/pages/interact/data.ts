import { useMemo } from "react";

import {
  useModuleByAddressLcd,
  useModulesByAddressLcd,
} from "lib/services/move";
import type { Addr, IndexedModule, Option } from "lib/types";

export const useSearchModules = ({
  address,
  moduleName,
  onModuleSuccess,
  onModulesSuccess,
  onError,
}: {
  address: Addr;
  moduleName: Option<string>;
  onModuleSuccess: (modules: IndexedModule) => void;
  onModulesSuccess: (modules: IndexedModule[]) => void;
  onError: (err: unknown) => void;
}) => {
  const { refetch: refetchModule, isFetching: isModuleFetching } =
    useModuleByAddressLcd({
      address,
      moduleName: moduleName ?? "",
      options: {
        refetchOnWindowFocus: false,
        enabled: false,
        retry: false,
        onSuccess: onModuleSuccess,
        onError,
      },
    });
  const { refetch: refetchModules, isFetching: isModulesFetching } =
    useModulesByAddressLcd({
      address,
      options: {
        refetchOnWindowFocus: false,
        enabled: false,
        retry: false,
        onSuccess: onModulesSuccess,
        onError,
      },
    });

  const refetch = useMemo(
    () => (moduleName ? refetchModule : refetchModules),
    [moduleName, refetchModule, refetchModules]
  );

  return {
    refetch,
    isFetching: isModuleFetching || isModulesFetching,
  };
};
