import { SimpleGrid } from "@chakra-ui/react";
import { useMemo } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ModuleCard } from "lib/components/module";
import { EmptyState } from "lib/components/state";
import type { IndexedModule } from "lib/services/move/moduleService";
import type { MoveAccountAddr, Option } from "lib/types";

interface ModuleListsBodyProps {
  selectedAddress: MoveAccountAddr;
  keyword: string;
  modules: Option<IndexedModule[]>;
  isLoading: boolean;
  onViewMore?: () => void;
}

export const ModuleListsBody = ({
  selectedAddress,
  keyword,
  modules,
  isLoading,
  onViewMore,
}: ModuleListsBodyProps) => {
  const navigate = useInternalNavigate();

  const filteredModules = useMemo(() => {
    if (!keyword) return modules;

    return modules?.filter(
      (module) =>
        module.moduleName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, modules]);

  const handleOnSelect = (module: IndexedModule) => {
    navigate({
      pathname: `/modules/[address]/[moduleName]`,
      query: {
        address: selectedAddress,
        moduleName: module.moduleName,
      },
    });
  };

  if (isLoading) return <Loading />;
  if (!modules) return <ErrorFetching />;
  if (!filteredModules?.length)
    return (
      <EmptyState
        imageVariant={!keyword ? "empty" : "not-found"}
        message={!keyword ? "No modules found" : "No matched modules found"}
        withBorder
        my={0}
      />
    );
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
      {(onViewMore ? filteredModules.slice(0, 9) : filteredModules).map(
        (item) => (
          <ModuleCard
            key={item.moduleName}
            selectedAddress={selectedAddress}
            module={item}
            selectedModule={undefined}
            setSelectedModule={handleOnSelect}
          />
        )
      )}
    </SimpleGrid>
  );
};
