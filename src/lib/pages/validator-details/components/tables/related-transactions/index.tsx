import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
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

  if (isLoading) return <Loading />;
  if (!delegationRelatedTxs)
    return <ErrorFetching dataName="delegation related txs" />;

  const templateColumns = "max(180px) max(180px) max(180px) 1fr max(280px)";

  return isMobile ? (
    <MobileTableContainer>
      {delegationRelatedTxs?.map((delegationRelatedTx) => (
        <RelatedTransactionsMobileCard
          delegationRelatedTx={delegationRelatedTx}
          assetInfos={assetInfos}
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
        />
      ))}
    </TableContainer>
  );
};
