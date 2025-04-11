import type { ValidatorAddr } from "lib/types";

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
      alignItems="center"
      backgroundColor="gray.900"
      justifyContent="space-between"
      p={4}
      rounded={8}
      w="100%"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
    >
      <TableTitle count={data?.total ?? 0} mb={0} title="Proposed blocks" />
      <CustomIcon boxSize={6} color="gray.600" m={0} name="chevron-right" />
    </Flex>
  ) : (
    <Flex direction="column" gap={4} mt={4}>
      <TableTitle
        id={scrollComponentId}
        count={data?.total ?? 0}
        helperText={
          onViewMore
            ? undefined
            : "Display the proposed blocks by this validator within the last 30 days"
        }
        mb={0}
        title="Proposed blocks"
      />
      <BlocksTable
        blocks={data?.items}
        emptyState={
          <EmptyState
            imageVariant={onViewMore ? undefined : "empty"}
            message="This validator never proposed any blocks."
            withBorder
          />
        }
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
                offset={offset}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                scrollComponentId={scrollComponentId}
                totalData={data.total}
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
