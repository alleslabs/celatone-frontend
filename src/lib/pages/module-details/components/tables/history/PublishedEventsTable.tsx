import { TableContainer } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer } from "lib/components/table";
import type { ModuleHistory } from "lib/services/types";
import type { Option } from "lib/types";

import { PublishedEventsTableHeader } from "./PublishedEventsTableHeader";
import { PublishedEventsTableMobileCard } from "./PublishedEventsTableMobileCard";
import { PublishedEventsTableRow } from "./PublishedEventsTableRow";

interface PublishedEventsTableProps {
  moduleHistories: Option<ModuleHistory[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const PublishedEventsTable = ({
  moduleHistories,
  isLoading,
  emptyState,
}: PublishedEventsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!moduleHistories?.length) return emptyState;

  const templateColumns = "40px 180px minmax(300px, 1fr) 140px 260px";

  return isMobile ? (
    <MobileTableContainer>
      {moduleHistories.map((history) => (
        <PublishedEventsTableMobileCard
          key={history.height}
          history={history}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <PublishedEventsTableHeader templateColumns={templateColumns} />
      {moduleHistories.map((history) => (
        <PublishedEventsTableRow
          key={JSON.stringify(history)}
          templateColumns={templateColumns}
          history={history}
        />
      ))}
    </TableContainer>
  );
};
