import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { ModuleInfo, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { mergeModulePath } from "lib/utils";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { ModulesTableHeader } from "./ModulesTableHeader";
import { ModulesTableMobileCard } from "./ModulesTableMobileCard";
import { ModulesTableRow } from "./ModulesTableRow";

interface ModulesTableProps {
  emptyState: JSX.Element;
  isLoading: boolean;
  isPublishedModules?: boolean;
  modules: Option<ModuleInfo[]>;
  moveVerifyInfos: Option<Record<string, MoveVerifyInfoResponse>>;
}

export const ModulesTable = ({
  emptyState,
  isLoading,
  isPublishedModules = false,
  modules,
  moveVerifyInfos,
}: ModulesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!modules?.length) return emptyState;

  const templateColumns = isPublishedModules
    ? "minmax(190px, 1fr) max(190px) max(190px) max(190px) 250px"
    : "minmax(190px, 1fr) 180px 170px 256px 146px";

  return isMobile ? (
    <MobileTableContainer>
      {modules.map((module) => (
        <ModulesTableMobileCard
          key={module.address + module.moduleName}
          moduleInfo={module}
          moveVerifyInfo={
            moveVerifyInfos?.[
              mergeModulePath(module.address, module.moduleName)
            ]
          }
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ModulesTableHeader
        isPublishedModules={isPublishedModules}
        templateColumns={templateColumns}
      />
      {modules.map((module) => (
        <ModulesTableRow
          key={module.address + module.moduleName}
          isPublishedModules={isPublishedModules}
          moduleInfo={module}
          moveVerifyInfo={
            moveVerifyInfos?.[
              mergeModulePath(module.address, module.moduleName)
            ]
          }
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
