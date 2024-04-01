import { TableContainer } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { BlocksTableHeader } from "lib/pages/blocks/components/BlocksTableHeader";
import { BlocksTableMobileCard } from "lib/pages/blocks/components/BlocksTableMobileCard";
import { BlocksTableRow } from "lib/pages/blocks/components/BlocksTableRow";
import type { BlocksResponse } from "lib/services/block";
import type { Option } from "lib/types";

const TEMPLATE_COLUMNS = "150px minmax(160px, 1fr) 180px 280px";

interface ProposedBlocksTableBodyProps {
  data: Option<BlocksResponse>;
  scrollComponentId: string;
  isLoading: boolean;
  onViewMore?: () => void;
}

export const ProposedsBlockTableBody = ({
  data,
  isLoading,
  scrollComponentId,
  onViewMore,
}: ProposedBlocksTableBodyProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="blocks" />;
  if (!data.total)
    return (
      <EmptyState
        imageVariant={onViewMore ? undefined : "empty"}
        message="This validator never proposed any blocks."
        withBorder
      />
    );

  return isMobile ? (
    <MobileTableContainer>
      {data.items.map((block) => (
        <BlocksTableMobileCard
          key={block.hash}
          blockData={block}
          hideProposer
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BlocksTableHeader
        templateColumns={TEMPLATE_COLUMNS}
        scrollComponentId={scrollComponentId}
        hideProposer
      />
      {data.items.map((block) => (
        <BlocksTableRow
          key={block.hash}
          templateColumns={TEMPLATE_COLUMNS}
          blockData={block}
          hideProposer
        />
      ))}
    </TableContainer>
  );
};
