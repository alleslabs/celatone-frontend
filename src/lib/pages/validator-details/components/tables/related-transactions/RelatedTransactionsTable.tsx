import { Box } from "@interchain-ui/react";

import { Loading } from "lib/components/Loading";
import { TableContainer } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/validator";
import type { AssetInfos, Option } from "lib/types";

import { RelatedTransactionsTableHeader } from "./RelatedTransactionsTableHeader";
import { RelatedTransactionsTableRow } from "./RelatedTransactionsTableRow";

interface RelatedTransactionTableProps {
  delegationRelatedTxs: Option<ValidatorDelegationRelatedTxsResponseItem[]>;
  isLoading: boolean;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionTable = ({
  delegationRelatedTxs = [],
  isLoading,
  assetInfos,
}: RelatedTransactionTableProps) => {
  if (isLoading) return <Loading />;

  const templateColumns = "1fr 1fr 1fr 1fr 1fr";

  return (
    <Box>
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
    </Box>
  );
};
