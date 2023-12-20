import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { CollectionMutateEvent } from "lib/services/collection";

import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
// import { MutateEventsTableMobileCard } from "./MutateEventsTableMobileCard";
import { MutateEventsTableRow } from "./MutateEventsTableRow";

interface MutateEventsTableProps {
  mutateEvents?: CollectionMutateEvent[];
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
  if (!mutateEvents || !mutateEvents.length) return emptyState;

  const templateColumns = `130px minmax(250px, 1fr) 50px minmax(250px, 1fr) 280px 180px`;

  return isMobile ? (
    <MobileTableContainer>
      {mutateEvents.map(() => {
        return (
          <div>TODO</div>
          // <MutateEventsTableMobileCard
          //   key={arrayKey}
          //   hash={transaction.txhash}
          //   timestamp={transaction.timestamp}
          // />
        );
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
