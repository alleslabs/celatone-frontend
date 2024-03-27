import { useMobile } from "lib/app-provider";
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
import { useValidatorProposedBlocks } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

interface ProposedBlocksTableProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "150px minmax(160px, 1fr) 180px 280px";
const scrollComponentId = "proposed-block-table-header";

export const ProposedBlocksTable = ({
  validatorAddress,
  onViewMore,
}: ProposedBlocksTableProps) => {
  const isMobile = useMobile();

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
  if (error) return <ErrorFetching dataName="blocks" />;

  return (
    <>
      <TableTitle
        title="Proposed Blocks"
        count={data?.total ?? 0}
        mt={2}
        mb={1}
        helperText={
          onViewMore
            ? ""
            : "Display the proposed blocks by this validator within the last 30 days"
        }
      />
      {data?.total ? (
        <>
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
            </TableContainer>
          )}
          {onViewMore && data.total > 5 && (
            <ViewMore
              onClick={onViewMore}
              text={`View all proposed blocks (${data.total})`}
            />
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
        </>
      ) : (
        <EmptyState
          imageVariant={onViewMore ? undefined : "empty"}
          message="This validator never proposed any blocks."
          withBorder
        />
      )}
    </>
  );
};
