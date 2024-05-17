import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { Activity } from "lib/services/nft/collection";
import type { HexAddr32, Option } from "lib/types";

import { ActivitiesTableHeader } from "./ActivitiesTableHeader";
import { ActivitiesTableMobileCard } from "./ActivitiesTableMobileCard";
import { ActivitiesTableRow } from "./ActivitiesTableRow";

interface ActivitiesTableProps {
  collectionAddress: HexAddr32;
  activities: Option<Activity[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const ActivitiesTable = ({
  collectionAddress,
  activities,
  isLoading,
  emptyState,
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
          collectionAddress={collectionAddress}
          activity={activity}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ActivitiesTableHeader templateColumns={templateColumns} />
      {activities.map((activity, index) => (
        <ActivitiesTableRow
          key={activity.txhash + index.toString()}
          collectionAddress={collectionAddress}
          activity={activity}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
