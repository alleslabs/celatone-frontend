import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/validator";
import type { AssetInfos, Option } from "lib/types";

import { RelatedTransactionsMobileCard } from "./RelatedTransactionsMobileCard";
import { RelatedTransactionsTableHeader } from "./RelatedTransactionsTableHeader";
import { RelatedTransactionsTableRow } from "./RelatedTransactionsTableRow";

interface RelatedTransactionTableProps {
  delegationRelatedTxs: Option<ValidatorDelegationRelatedTxsResponseItem[]>;
  isLoading: boolean;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionTable = ({
  delegationRelatedTxs,
  isLoading,
  assetInfos,
}: RelatedTransactionTableProps) => {
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
        <RelatedTransactionsMobileCard
          key={delegationRelatedTx.txHash}
          delegationRelatedTx={delegationRelatedTx}
          assetInfos={assetInfos}
          onRowSelect={onRowSelect}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <RelatedTransactionsTableHeader templateColumns={templateColumns} />
      {delegationRelatedTxs.map((delegationRelatedTx) => (
        <RelatedTransactionsTableRow
          key={delegationRelatedTx.txHash}
          templateColumns={templateColumns}
          delegationRelatedTx={delegationRelatedTx}
          assetInfos={assetInfos}
          onRowSelect={onRowSelect}
        />
      ))}
    </TableContainer>
  );
};
