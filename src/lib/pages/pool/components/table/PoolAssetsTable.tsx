import type { Big } from "big.js";

import { TableContainer } from "lib/components/table/tableComponents";
import type { PoolDetail, PoolLiquidity, USD } from "lib/types";

// import type { Option, Proposal } from "lib/types";
import { PoolAssetsTableHeader } from "./PoolAssetsTableHeader";
import { PoolAssetsTableRow } from "./PoolAssetsTableRow";
// import { PoolAssetsTableRow } from "./PoolAssetsTableRow";

interface PoolAssetsTableProps {
  assets: PoolLiquidity[];
  pool_type: PoolDetail["pool_type"];
  // weight?: Option<PoolWeight[] | null>;
  // scaling_factors?: Option<string[] | null>;
  total_liquidity: USD<Big>;
}

export const PoolAssetsTable = ({
  assets,
  pool_type,
  // weight,
  // scaling_factors,
  total_liquidity,
}: PoolAssetsTableProps) => {
  // if (isLoading) return <Loading />;
  // if (!proposals?.length) return emptyState;

  const templateColumns = "minmax(300px, 1fr) 144px 144px minmax(300px, 1fr)";

  return (
    <TableContainer>
      <PoolAssetsTableHeader
        templateColumns={templateColumns}
        pool_type={pool_type}
      />
      {assets.map((asset) => (
        <PoolAssetsTableRow
          asset={asset}
          total_liquidity={total_liquidity}
          pool_type={pool_type}
          key={asset.denom}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
