import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MutateEventsTableMobileCard } from "lib/components/nft/MutateEventsTableCard";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { CollectionMutateEvent } from "lib/services/nft/collection";

import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
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
