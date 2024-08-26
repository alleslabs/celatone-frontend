import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { ModuleInfo, Option } from "lib/types";
import { mergeModulePath } from "lib/utils";

import { ModulesTableHeader } from "./ModulesTableHeader";
import { ModulesTableMobileCard } from "./ModulesTableMobileCard";
import { ModulesTableRow } from "./ModulesTableRow";

interface ModulesTableProps {
  modules: Option<ModuleInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  isPublishedModules?: boolean;
  moveVerifyInfos: Option<Record<string, MoveVerifyInfoResponse>>;
}

export const ModulesTable = ({
  modules,
  isLoading,
  emptyState,
  isPublishedModules = false,
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
        templateColumns={templateColumns}
        isPublishedModules={isPublishedModules}
      />
      {modules.map((module) => (
        <ModulesTableRow
          key={module.address + module.moduleName}
          moduleInfo={module}
          templateColumns={templateColumns}
          isPublishedModules={isPublishedModules}
          moveVerifyInfo={
            moveVerifyInfos?.[
              mergeModulePath(module.address, module.moduleName)
            ]
          }
        />
      ))}
    </TableContainer>
  );
};
