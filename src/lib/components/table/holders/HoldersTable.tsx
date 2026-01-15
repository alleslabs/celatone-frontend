import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { HoldersTableHeader } from "./HoldersTableHeader";
import { HoldersTableMobileCard } from "./HoldersTableMobileCard";
import { HoldersTableRow } from "./HoldersTableRow";

interface HoldersTableProps {
  assetInfos: Option<AssetInfos>;
  emptyState: ReactNode;
  evmDenom: string;
  holders: TokenHolder[];
  isLoading: boolean;
  offset: number;
  totalSupply: Nullable<bigint>;
}

export const HoldersTable = ({
  assetInfos,
  emptyState,
  evmDenom,
  holders,
  isLoading,
  offset,
  totalSupply,
}: HoldersTableProps) => {
  const isMobile = useMobile();
  const templateColumns = "64px 1fr 200px 160px";

  if (isLoading) return <Loading />;
  if (!holders || holders.length === 0) return emptyState;

  return isMobile ? (
    <MobileTableContainer>
      {holders.map((holder, index) => (
        <HoldersTableMobileCard
          key={holder.account}
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          holder={holder}
          rank={offset + index + 1}
          totalSupply={totalSupply}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <HoldersTableHeader templateColumns={templateColumns} />
      {holders.map((holder, index) => (
        <HoldersTableRow
          key={holder.account}
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          holder={holder}
          rank={offset + index + 1}
          templateColumns={templateColumns}
          totalSupply={totalSupply}
        />
      ))}
    </TableContainer>
  );
};
