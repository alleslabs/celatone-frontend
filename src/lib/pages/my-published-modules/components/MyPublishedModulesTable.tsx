import { useMemo, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import {
  DisconnectedState,
  EmptyState,
  ErrorFetching,
} from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useModulesByAddress } from "lib/services/move/module";
import { useMoveVerifyInfosByAddress } from "lib/services/verification/move";
import type { ModuleInfo, Option } from "lib/types";

export const MyPublishedModulesTable = () => {
  const [keyword, setKeyword] = useState("");
  const { address } = useCurrentChain();

  const {
    data,
    error,
    isFetching: isModulesLoading,
  } = useModulesByAddress({ address });

  const { data: moveVerifyInfos } = useMoveVerifyInfosByAddress(address);

  const filteredPublishedModules: Option<ModuleInfo[]> = useMemo(() => {
    if (!keyword) return data?.items;

    return data?.items.filter((module) =>
      module.moduleName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, data?.items]);

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
        my={8}
        size="lg"
        value={keyword}
        amptrackSection="my-published-modules-search"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Module Name"
      />
      {address ? (
        <ModulesTable
          emptyState={emptyState()}
          isLoading={isModulesLoading}
          isPublishedModules
          modules={filteredPublishedModules}
          moveVerifyInfos={moveVerifyInfos}
        />
      ) : (
        <DisconnectedState text="to see your published modules" />
      )}
    </>
  );
};
