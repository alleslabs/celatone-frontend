import type { TokenHolder } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
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
  isReversed: boolean;
  offset: number;
  onToggleSort: () => void;
}

export const HoldersTable = ({
  assetInfos,
  emptyState,
  evmDenom,
  holders,
  isLoading,
  isReversed,
  offset,
  onToggleSort,
}: HoldersTableProps) => {
  const isMobile = useMobile();
  const templateColumns = "64px 1fr 300px";

  if (isLoading) return <Loading />;
  if (!holders || holders.length === 0) return emptyState;

  return isMobile ? (
    <MobileTableContainer>
      {holders.map((holder, index) => (
        <HoldersTableMobileCard
          key={`${holder.account}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          holder={holder}
          rank={offset + index + 1}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <HoldersTableHeader
        isReversed={isReversed}
        templateColumns={templateColumns}
        onToggleSort={onToggleSort}
      />
      {holders.map((holder, index) => (
        <HoldersTableRow
          key={`${holder.account}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmDenom}
          holder={holder}
          rank={offset + index + 1}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
