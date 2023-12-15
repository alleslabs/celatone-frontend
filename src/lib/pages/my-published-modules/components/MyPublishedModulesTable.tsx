import { useMemo, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { DisconnectedState, EmptyState } from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAPIAccountModules } from "lib/services/move/moduleService";
import type { HumanAddr } from "lib/types";

export const MyPublishedModulesTable = () => {
  const [keyword, setKeyword] = useState("");
  const { address } = useCurrentChain();

  const {
    data: modulesData,
    isFetching: isModulesLoading,
    error,
  } = useAPIAccountModules(address as HumanAddr);

  const formatAddresses = useFormatAddresses();
  const mappedModules = modulesData?.map((module) => {
    return {
      address: formatAddresses(module.address).address,
      name: module.moduleName,
      functions: {
        view: module.viewFunctions.length,
        execute: module.executeFunctions.length,
      },
    };
  });

  const filteredPublishedModules = useMemo(() => {
    if (!keyword) return mappedModules;

    return mappedModules?.filter(
      (module) => module.name?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, mappedModules]);
  return (
    <>
      <InputWithIcon
        placeholder="Search with Module Name..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        action="my-published-modules-search"
        my={4}
      />
      {address ? (
        <ModulesTable
          isPublishedModules
          modules={filteredPublishedModules}
          isLoading={isModulesLoading}
          emptyState={
            error ? (
              <EmptyState
                withBorder
                imageVariant="not-found"
                message="There is an error during fetching recent modules."
              />
            ) : (
              <EmptyState
                withBorder
                imageVariant="empty"
                message="No matching module found. Make sure you are searching with Module Name."
              />
            )
          }
        />
      ) : (
        <DisconnectedState text="to see your published modules" my={16} />
      )}
    </>
  );
};
