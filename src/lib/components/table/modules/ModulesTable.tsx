import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { ModuleInfo, Option } from "lib/types";

import { ModulesTableHeader } from "./ModulesTableHeader";
import { ModulesTableMobileCard } from "./ModulesTableMobileCard";
import { ModulesTableRow } from "./ModulesTableRow";

interface ModulesTableProps {
  modules: Option<ModuleInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const ModulesTable = ({
  modules,
  isLoading,
  emptyState,
}: ModulesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!modules?.length) return emptyState;

  const templateColumns = `minmax(190px, 1fr) max(190px) max(230px) 250px`;

  return isMobile ? (
    <MobileTableContainer>
      {modules.map((module) => (
        <ModulesTableMobileCard key={module.name} moduleInfo={module} />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ModulesTableHeader templateColumns={templateColumns} />
      {modules.map((module) => (
        <ModulesTableRow
          key={module.name}
          moduleInfo={module}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};