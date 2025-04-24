import type { MutateEvent, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
import { MutateEventsTableMobileCard } from "./MutateEventsTableMobileCard";
import { MutateEventsTableRow } from "./MutateEventsTableRow";

interface MutateEventsTableProps {
  emptyState: JSX.Element;
  isLoading: boolean;
  mutateEvents: Option<MutateEvent[]>;
}

export const MutateEventsTable = ({
  emptyState,
  isLoading,
  mutateEvents,
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
