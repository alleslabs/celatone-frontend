import type { Big } from "big.js";

import { TableContainer } from "lib/components/table/tableComponents";
import type { PoolDetail, TokenWithValue, USD } from "lib/types";

import { PoolAssetsTableHeader } from "./PoolAssetsTableHeader";
import { PoolAssetsTableRow } from "./PoolAssetsTableRow";

interface PoolAssetsTableProps {
  pool: PoolDetail<Big, TokenWithValue>;
  totalLiquidity: USD<Big>;
}

const TEMPLATE_COLUMNS = "minmax(300px, 1fr) 144px 144px minmax(300px, 1fr)";

export const PoolAssetsTable = ({
  pool,
  totalLiquidity,
}: PoolAssetsTableProps) => (
  <TableContainer>
    <PoolAssetsTableHeader
      templateColumns={TEMPLATE_COLUMNS}
      poolType={pool.type}
      isSupported={pool.isSupported}
    />
    {pool.poolLiquidity.map((token, idx) => (
      <PoolAssetsTableRow
        key={`${token.denom}-token-row`}
        templateColumns={TEMPLATE_COLUMNS}
        token={token}
        pool={pool}
        totalLiquidity={totalLiquidity}
        liquidityIndex={idx}
      />
    ))}
  </TableContainer>
);
