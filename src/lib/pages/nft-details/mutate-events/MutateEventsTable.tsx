import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { NFTMutateEventsPagination } from "lib/services/nft";

import { MutateEventsTableHeader } from "./MutateEventsTableHeader";
import { MutateEventsTableMobileCard } from "./MutateEventsTableMobileCard";
import { MutateEventsTableRow } from "./MutateEventsTableRow";

interface MutateEventsTableProps {
  mutateEvents?: NFTMutateEventsPagination[];
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
