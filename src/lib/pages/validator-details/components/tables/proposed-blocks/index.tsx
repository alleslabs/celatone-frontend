import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle, ViewMore } from "lib/components/table";
import { useValidatorProposedBlocks } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

import { ProposedsBlockTableBody } from "./ProposedBlocksTableBody";

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
      onClick={onViewMore}
    >
      <TableTitle title="Proposed Blocks" count={data?.total ?? 0} mb={0} />
      <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex direction="column" gap={6}>
      <TableTitle
        title="Proposed Blocks"
        count={data?.total ?? 0}
        helperText={
          onViewMore
            ? ""
            : "Display the proposed blocks by this validator within the last 30 days"
        }
        mb={0}
      />
      <ProposedsBlockTableBody
        data={data}
        scrollComponentId={scrollComponentId}
        isLoading={isLoading}
        onViewMore={onViewMore}
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