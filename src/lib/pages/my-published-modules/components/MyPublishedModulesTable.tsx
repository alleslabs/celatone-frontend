import type { ModuleInfo, Option } from "lib/types";

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
import { bech32AddressToHex } from "lib/utils";
import { useMemo, useState } from "react";

export const MyPublishedModulesTable = () => {
  const [keyword, setKeyword] = useState("");
  const { address } = useCurrentChain();

  const {
    data,
    isFetching: isModulesLoading,
    error,
  } = useModulesByAddress({ address });

  const { data: moveVerifyInfos } = useMoveVerifyInfosByAddress(
    address ? bech32AddressToHex(address) : undefined
  );

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
        amptrackSection="my-published-modules-search"
        my={8}
        placeholder="Search with Module Name"
        size="lg"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
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
