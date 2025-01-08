import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { MutateEvent, Option } from "lib/types";

import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
import { MutateEventsTableMobileCard } from "./MutateEventsTableMobileCard";
import { MutateEventsTableRow } from "./MutateEventsTableRow";

interface MutateEventsTableProps {
  mutateEvents: Option<MutateEvent[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
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
      {mutateEvents.map((event) => (
        <MutateEventsTableMobileCard
          key={event.mutatedFieldName + event.newValue + event.oldValue}
          {...event}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <MutateEventsTableHeader templateColumns={templateColumns} />
      {mutateEvents.map((event) => (
        <MutateEventsTableRow
          key={event.mutatedFieldName + event.newValue + event.oldValue}
          templateColumns={templateColumns}
          {...event}
        />
      ))}
    </TableContainer>
  );
};
