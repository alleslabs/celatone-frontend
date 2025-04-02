import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/types";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";

import { DelegationRelatedTxsTableHeader } from "./DelegationRelatedTxsTableHeader";
import { DelegationRelatedTxsTableMobileCard } from "./DelegationRelatedTxsTableMobileCard";
import { DelegationRelatedTxsTableRow } from "./DelegationRelatedTxsTableRow";

interface DelegationRelatedTxsTableProps {
  delegationRelatedTxs: Option<ValidatorDelegationRelatedTxsResponseItem[]>;
  isLoading: boolean;
  assetInfos: Option<AssetInfos>;
  movePoolInfos: Option<MovePoolInfos>;
}

export const DelegationRelatedTxsTable = ({
  delegationRelatedTxs,
  isLoading,
  assetInfos,
  movePoolInfos,
}: DelegationRelatedTxsTableProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const onRowSelect = (txHash: string) =>
    navigate({
      pathname: "/txs/[txHash]",
      query: { txHash: txHash.toUpperCase() },
    });

  if (isLoading) return <Loading />;
  if (!delegationRelatedTxs)
    return <ErrorFetching dataName="delegation related txs" />;
  if (!delegationRelatedTxs.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="This validator has not seen any changes in voting power."
        withBorder
      />
    );

  const templateColumns = "max(180px) max(180px) max(180px) 1fr max(280px)";

  return isMobile ? (
    <MobileTableContainer>
      {delegationRelatedTxs.map((delegationRelatedTx) => (
        <DelegationRelatedTxsTableMobileCard
          key={delegationRelatedTx.txHash}
          assetInfos={assetInfos}
          delegationRelatedTx={delegationRelatedTx}
          movePoolInfos={movePoolInfos}
          onRowSelect={onRowSelect}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <DelegationRelatedTxsTableHeader templateColumns={templateColumns} />
      {delegationRelatedTxs.map((delegationRelatedTx) => (
        <DelegationRelatedTxsTableRow
          key={delegationRelatedTx.txHash}
          assetInfos={assetInfos}
          delegationRelatedTx={delegationRelatedTx}
          movePoolInfos={movePoolInfos}
          templateColumns={templateColumns}
          onRowSelect={onRowSelect}
        />
      ))}
    </TableContainer>
  );
};
