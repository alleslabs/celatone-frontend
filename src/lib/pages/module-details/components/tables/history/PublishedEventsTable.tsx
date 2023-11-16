import { TableContainer } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { MobileTableContainer } from "lib/components/table";
import type { ModuleHistory } from "lib/types";

import { ModuleHistoryHeader } from "./ModuleHistoryHeader";
import { ModuleHistoryRow } from "./ModuleHistoryRow";
import { PublishedEventsMobileCard } from "./PublishedEventsMobileCard";

interface PublishedEventsTableProps {
  moduleHistories: ModuleHistory[];
  pageSize: number;
  templateColumns: string;
}

export const PublishedEventsTable = ({
  moduleHistories,
  templateColumns,
  pageSize,
}: PublishedEventsTableProps) => {
  const isMobile = useMobile();

  return isMobile ? (
    <MobileTableContainer>
      {moduleHistories.slice(0, pageSize).map((history) => (
        <PublishedEventsMobileCard key={history.height} history={history} />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ModuleHistoryHeader templateColumns={templateColumns} />
      {moduleHistories.slice(0, pageSize).map((history) => (
        <ModuleHistoryRow
          key={JSON.stringify(history)}
          templateColumns={templateColumns}
          history={history}
        />
      ))}
    </TableContainer>
  );
};
