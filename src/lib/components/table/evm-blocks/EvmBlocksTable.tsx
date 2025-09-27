import type { Block, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";

import { EvmBlocksTableHeader } from "./EvmBlocksTableHeader";
import { EvmBlocksTableMobileCard } from "./EvmBlocksTableMobileCard";
import { EvmBlocksTableRow } from "./EvmBlocksTableRow";

interface EvmBlocksTableProps {
  blocks: Option<Block[]>;
  emptyState: JSX.Element;
  isLoading: boolean;
}

export const EvmBlocksTable = ({
  blocks,
  emptyState,
  isLoading,
}: EvmBlocksTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!blocks) return <ErrorFetching dataName="blocks" />;
  if (!blocks.length) return emptyState;

  const templateColumns = "140px 160px minmax(300px,1fr) 120px 280px";

  return isMobile ? (
    <MobileTableContainer>
      {blocks.map((block) => (
        <EvmBlocksTableMobileCard key={block.hash} blockData={block} />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <EvmBlocksTableHeader templateColumns={templateColumns} />
      {blocks.map((block) => (
        <EvmBlocksTableRow
          key={block.hash}
          blockData={block}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
