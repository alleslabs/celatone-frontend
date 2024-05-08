import { Flex } from "@chakra-ui/react";

import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { BlocksTable } from "lib/components/table/blocks";
import { useValidatorProposedBlocks } from "lib/services/validator";
import type { ValidatorAddr } from "lib/types";

const scrollComponentId = "proposed-block-table-header";

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

  const { data, isLoading } = useValidatorProposedBlocks(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  return isMoibleOverview ? (
    <Flex
      backgroundColor="gray.900"
      p={4}
      rounded={8}
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
    >
      <TableTitle title="Proposed Blocks" count={data?.total ?? 0} mb={0} />
      <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex direction="column" gap={6}>
      <TableTitle
        id={scrollComponentId}
        title="Proposed Blocks"
        count={data?.total ?? 0}
        helperText={
          onViewMore
            ? ""
            : "Display the proposed blocks by this validator within the last 30 days"
        }
        mb={0}
      />
      <BlocksTable
        blocks={data?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant={onViewMore ? undefined : "empty"}
            message="This validator never proposed any blocks."
            withBorder
          />
        }
        showProposer={false}
      />
      {data &&
        (onViewMore
          ? data.total > 5 && (
              <ViewMore
                onClick={onViewMore}
                text={`View all proposed blocks (${data.total})`}
              />
            )
          : data.total > 10 && (
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
            ))}
    </Flex>
  );
};
