import { useMemo, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import {
  DisconnectedState,
  EmptyState,
  ErrorFetching,
} from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useModulesByAddress } from "lib/services/move/moduleService";
import type { HumanAddr } from "lib/types";

export const MyPublishedModulesTable = () => {
  const [keyword, setKeyword] = useState("");
  const { address } = useCurrentChain();

  const {
    data: modulesData,
    isFetching: isModulesLoading,
    error,
  } = useModulesByAddress(address as HumanAddr);

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

  const emptyState = () => {
    if (error) return <ErrorFetching dataName="published modules" />;
    if (!keyword)
      return (
        <EmptyState
          imageVariant="empty"
          message="There is currently no published modules."
          withBorder
        />
      );
    return (
      <EmptyState
        imageVariant="not-found"
        message="No matching module found. Make sure you are searching with Module Name."
        withBorder
      />
    );
  };

  return (
    <>
      <InputWithIcon
        placeholder="Search with Module Name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        amptrackSection="my-published-modules-search"
        size="lg"
        my={8}
      />
      {address ? (
        <ModulesTable
          modules={filteredPublishedModules}
          isLoading={isModulesLoading}
          emptyState={emptyState()}
          isPublishedModules
        />
      ) : (
        <DisconnectedState text="to see your published modules" />
      )}
    </>
  );
};
