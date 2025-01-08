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
  onViewMore?: () => void;
  validatorAddress: ValidatorAddr;
}

export const ProposedBlocksTable = ({
  onViewMore,
  validatorAddress,
}: ProposedBlocksTableProps) => {
  const isMobile = useMobile();
  const isMoibleOverview = isMobile && !!onViewMore;

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
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
      alignItems="center"
      p={4}
      w="100%"
      backgroundColor="gray.900"
      justifyContent="space-between"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
      rounded={8}
    >
      <TableTitle mb={0} title="Proposed Blocks" count={data?.total ?? 0} />
      <CustomIcon m={0} name="chevron-right" boxSize={6} color="gray.600" />
    </Flex>
  ) : (
    <Flex gap={4} mt={4} direction="column">
      <TableTitle
        id={scrollComponentId}
        helperText={
          onViewMore
            ? undefined
            : "Display the proposed blocks by this validator within the last 30 days"
        }
        mb={0}
        title="Proposed Blocks"
        count={data?.total ?? 0}
      />
      <BlocksTable
        emptyState={
          <EmptyState
            imageVariant={onViewMore ? undefined : "empty"}
            message="This validator never proposed any blocks."
            withBorder
          />
        }
        blocks={data?.items}
        isLoading={isLoading}
        showProposer={false}
      />
      {data &&
        (onViewMore
          ? data.total > 5 && (
              <ViewMore
                text={`View all proposed blocks (${data.total})`}
                onClick={onViewMore}
              />
            )
          : data.total > 10 && (
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                offset={offset}
                onPageChange={setCurrentPage}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                scrollComponentId={scrollComponentId}
                totalData={data.total}
              />
            ))}
    </Flex>
  );
};
