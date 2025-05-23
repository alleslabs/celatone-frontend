import type { HexAddr, IndexedModule, Option } from "lib/types";

import { SimpleGrid } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { ModuleCard } from "lib/components/module";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useMoveVerifyInfosByAddress } from "lib/services/verification/move";
import { mergeModulePath } from "lib/utils";
import { useMemo } from "react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";

interface ModuleListsBodyProps {
  address: HexAddr;
  isLoading: boolean;
  keyword: string;
  modules: Option<IndexedModule[]>;
  onViewMore?: () => void;
}

export const ModuleListsBody = ({
  address,
  isLoading,
  keyword,
  modules,
  onViewMore,
}: ModuleListsBodyProps) => {
  const { data: moveVerifyInfos } = useMoveVerifyInfosByAddress(address);
  const filteredModules = useMemo(() => {
    if (!keyword) return modules;

    return modules?.filter((module) =>
      module.moduleName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, modules]);

  if (isLoading) return <Loading />;

  if (!modules)
    return (
      <ErrorFetching
        dataName="modules"
        hasBorderTop={false}
        my={2}
        withBorder
      />
    );
  if (!modules.length)
    return (
      <AccountDetailsEmptyState message="No modules are on this account." />
    );

  if (!filteredModules?.length)
    return (
      <EmptyState
        imageVariant="not-found"
        message="No matched modules found"
        withBorder
      />
    );
  return (
    <SimpleGrid columns={{ lg: 3, md: 2, sm: 1 }} my={4} spacing={4}>
      {(onViewMore ? filteredModules.slice(0, 9) : filteredModules).map(
        (item) => (
          <ModuleCard
            key={item.moduleName}
            module={item}
            moveVerifyInfo={
              moveVerifyInfos?.[mergeModulePath(item.address, item.moduleName)]
            }
            selectedModule={undefined}
          />
        )
      )}
    </SimpleGrid>
  );
};
