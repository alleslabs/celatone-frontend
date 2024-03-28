import { Box, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { BlocksTableHeader } from "lib/pages/blocks/components/BlocksTableHeader";
import { BlocksTableMobileCard } from "lib/pages/blocks/components/BlocksTableMobileCard";
import { BlocksTableRow } from "lib/pages/blocks/components/BlocksTableRow";
import type { BlocksResponse } from "lib/services/block";
import { useValidatorProposedBlocks } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

const TEMPLATE_COLUMNS = "150px minmax(160px, 1fr) 180px 280px";
const scrollComponentId = "proposed-block-table-header";

interface ProposedBlocksTableBodyProps {
  data: BlocksResponse;
  onViewMore?: () => void;
  isMobile: boolean;
  currentPage: number;
  offset: number;
  pageSize: number;
  pagesQuantity: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const ProposedBlocksTableBody = ({
  data,
  onViewMore,
  isMobile,
  currentPage,
  offset,
  pageSize,
  pagesQuantity,
  setCurrentPage,
  setPageSize,
}: ProposedBlocksTableBodyProps) => (
  <Box>
    {isMobile ? (
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
        {onViewMore && data.total > 5 && (
          <ViewMore
            onClick={onViewMore}
            text={`View all proposed blocks (${data.total})`}
          />
        )}
      </TableContainer>
    )}
    {!onViewMore && data.total > 10 && (
      <Pagination
        currentPage={currentPage}
        pagesQuantity={pagesQuantity}
        offset={offset}
        totalData={data.total}
        scrollComponentId={scrollComponentId}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(e) => {
          const size = Number(e.target.value);
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    )}
  </Box>
);

interface ProposedBlocksTableProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

export const ProposedBlocksTable = ({
  validatorAddress,
  onViewMore,
}: ProposedBlocksTableProps) => {
  const isMobile = useMobile();
  const isMoibleOverview = isMobile && !!onViewMore;

  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading, error } = useValidatorProposedBlocks(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorFetching dataName="blocks" />;
  if (!data.total)
    return (
      <>
        <TableTitle
          title="Proposed Blocks"
          count={0}
          helperText={
            onViewMore
              ? ""
              : "Display the proposed blocks by this validator within the last 30 days"
          }
          mb={0}
        />
        <EmptyState
          imageVariant={onViewMore ? undefined : "empty"}
          message="This validator never proposed any blocks."
          withBorder
        />
      </>
    );

  return (
    <>
      {isMoibleOverview ? (
        <Flex
          backgroundColor="gray.900"
          p={4}
          rounded={8}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          onClick={onViewMore}
        >
          <TableTitle title="Proposed Blocks" count={data.total} mb={0} />
          <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <TableTitle
          title="Proposed Blocks"
          count={data.total}
          helperText={
            onViewMore
              ? ""
              : "Display the proposed blocks by this validator within the last 30 days"
          }
          mb={0}
        />
      )}
      {(!isMobile || !onViewMore) && (
        <ProposedBlocksTableBody
          data={data}
          onViewMore={onViewMore}
          isMobile={isMobile}
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      )}
    </>
  );
};
