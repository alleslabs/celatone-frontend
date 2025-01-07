import type Big from "big.js";

import { TableContainer } from "lib/components/table";
import { PoolType } from "lib/types";
import type { PoolData, USD } from "lib/types";

import { PoolAssetsTableHeader } from "./PoolAssetsTableHeader";
import { PoolAssetsTableRow } from "./PoolAssetsTableRow";

interface PoolAssetsTableProps {
  pool: PoolData;
  totalLiquidity: USD<Big>;
}

export const PoolAssetsTable = ({
  pool,
  totalLiquidity,
}: PoolAssetsTableProps) => {
  const templateColumns = `minmax(300px, 1fr) ${pool.type !== PoolType.COSMWASM ? "144px" : ""} 144px minmax(300px, 1fr)`;
  return (
    <TableContainer>
      <PoolAssetsTableHeader
        isSupported={pool.isSupported}
        poolType={pool.type}
        templateColumns={templateColumns}
      />
      {pool.liquidity.map((token, idx) => (
        <PoolAssetsTableRow
          key={`${token.denom}-token-row`}
          liquidityIndex={idx}
          totalLiquidity={totalLiquidity}
          pool={pool}
          templateColumns={templateColumns}
          token={token}
        />
      ))}
    </TableContainer>
  );
};
