import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { MutateEvent } from "lib/types";

import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
import { MutateEventsTableMobileCard } from "./MutateEventsTableMobileCard";
import { MutateEventsTableRow } from "./MutateEventsTableRow";

interface MutateEventsTableProps {
  mutateEvents?: MutateEvent[];
  isLoading?: boolean;
  emptyState?: JSX.Element;
}

export const MutateEventsTable = ({
  mutateEvents,
  isLoading,
  emptyState,
}: MutateEventsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!mutateEvents?.length) return emptyState;

  const templateColumns = `130px minmax(250px, 1fr) 64px minmax(250px, 1fr) 240px 180px`;

  return isMobile ? (
    <MobileTableContainer>
      {mutateEvents.map((event) => {
        const arrayKey = event.newValue + event.oldValue;
        return <MutateEventsTableMobileCard key={arrayKey} {...event} />;
      })}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <MutateEventsTableHeader templateColumns={templateColumns} />
      {mutateEvents.map((event) => {
        const arrayKey = event.newValue + event.oldValue;
        return (
          <MutateEventsTableRow
            key={arrayKey}
            templateColumns={templateColumns}
            {...event}
          />
        );
      })}
    </TableContainer>
  );
};
