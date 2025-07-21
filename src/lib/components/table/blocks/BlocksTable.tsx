import type { Block, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";

import { BlocksTableHeader } from "./BlocksTableHeader";
import { BlocksTableMobileCard } from "./BlocksTableMobileCard";
import { BlocksTableRow } from "./BlocksTableRow";

interface BlocksTableProps {
  blocks: Option<Block[]>;
  emptyState: JSX.Element;
  isLoading: boolean;
  showProposer?: boolean;
}

export const BlocksTable = ({
  blocks,
  emptyState,
  isLoading,
  showProposer = true,
}: BlocksTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!blocks) return <ErrorFetching dataName="blocks" />;
  if (!blocks.length) return emptyState;

  const templateColumns = showProposer
    ? "140px 160px minmax(300px,1fr) 120px 120px 280px"
    : "150px minmax(160px, 1fr) 180px 180px 280px";

  return isMobile ? (
    <MobileTableContainer>
      {blocks.map((block) => (
        <BlocksTableMobileCard
          key={block.hash}
          blockData={block}
          showProposer={showProposer}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BlocksTableHeader
        showProposer={showProposer}
        templateColumns={templateColumns}
      />
      {blocks.map((block) => (
        <BlocksTableRow
          key={block.hash}
          blockData={block}
          showProposer={showProposer}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
