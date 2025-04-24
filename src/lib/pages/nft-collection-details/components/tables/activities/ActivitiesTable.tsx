import type { Activity } from "lib/services/types";
import type { HexAddr32, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";

import { ActivitiesTableHeader } from "./ActivitiesTableHeader";
import { ActivitiesTableMobileCard } from "./ActivitiesTableMobileCard";
import { ActivitiesTableRow } from "./ActivitiesTableRow";

interface ActivitiesTableProps {
  activities: Option<Activity[]>;
  collectionAddress: HexAddr32;
  emptyState: JSX.Element;
  isLoading: boolean;
}

export const ActivitiesTable = ({
  activities,
  collectionAddress,
  emptyState,
  isLoading,
}: ActivitiesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!activities || !activities.length) return emptyState;

  const templateColumns = `190px minmax(360px, 1fr) 160px 280px`;

  return isMobile ? (
    <MobileTableContainer>
      {activities.map((activity, index) => (
        <ActivitiesTableMobileCard
          key={activity.txhash + index.toString()}
          activity={activity}
          collectionAddress={collectionAddress}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ActivitiesTableHeader templateColumns={templateColumns} />
      {activities.map((activity, index) => (
        <ActivitiesTableRow
          key={activity.txhash + index.toString()}
          activity={activity}
          collectionAddress={collectionAddress}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
