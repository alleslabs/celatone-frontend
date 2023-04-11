// import { Loading } from "lib/components/Loading";
import { TableContainer } from "lib/components/table/tableComponents";
// import type { Option, Proposal } from "lib/types";

import { PoolAssetsTableHeader } from "./PoolAssetsTableHeader";
// import { PoolAssetsTableRow } from "./PoolAssetsTableRow";

// interface ProposalsTableProps {
//   proposals: Option<Proposal[]>;
//   isLoading: boolean;
//   emptyState: JSX.Element;
// }

export const PoolAssetsTable = () => {
  // if (isLoading) return <Loading />;
  // if (!proposals?.length) return emptyState;

  const templateColumns = "minmax(300px, 1fr) 120px 120px minmax(300px, 1fr)";

  return (
    <TableContainer>
      <PoolAssetsTableHeader templateColumns={templateColumns} />
      {/* {proposals.map((proposal) => (
        <PoolAssetsTableRow
          key={proposal.proposalId}
          proposal={proposal}
          templateColumns={templateColumns}
        />
      ))} */}
    </TableContainer>
  );
};
