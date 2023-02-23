import { Box, Flex, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableContainer, TableHeader } from "lib/components/table";
import { CodesTableRow } from "lib/components/table/codes/CodesTableRow";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { useCodeStored } from "lib/pages/account-details/data";
import type { HumanAddr, Option } from "lib/types";

interface CodesTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const CodesTableBody = observer(
  ({
    walletAddress,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: CodesTableProps) => {
    const {
      pagesQuantity,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      offset,
    } = usePaginator({
      total: totalData,
      initialState: {
        pageSize: 10,
        currentPage: 1,
        isDisabled: false,
      },
    });
    const { codes, isLoading } = useCodeStored(
      walletAddress,
      offset,
      onViewMore ? 5 : pageSize
    );

    const onPageChange = (nextPage: number) => {
      refetchCount();
      setCurrentPage(nextPage);
    };

    const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      refetchCount();
      setPageSize(size);
      setCurrentPage(1);
    };

    const templateColumnsStyle =
      "max(80px) minmax(320px, 1fr) max(120px) max(160px) minmax(320px, 0.75fr)";

    if (isLoading) return <Loading />;
    if (!codes?.length)
      return (
        <Flex
          py="64px"
          direction="column"
          borderY="1px solid"
          borderColor="pebble.700"
        >
          <EmptyState message="This account did not stored any codes before." />
        </Flex>
      );
    return (
      <TableContainer>
        <Grid templateColumns={templateColumnsStyle} minW="min-content">
          <TableHeader borderTopStyle="none">Code ID</TableHeader>
          <TableHeader>Code Name</TableHeader>
          <TableHeader>Contracts</TableHeader>
          <TableHeader>Uploader</TableHeader>
          <TableHeader>Permission</TableHeader>
        </Grid>
        {codes.map((code) => (
          <CodesTableRow
            key={code.id + code.uploader + code.name}
            codeInfo={code}
            templateColumnsStyle={templateColumnsStyle}
          />
        ))}
        {totalData &&
          (onViewMore
            ? totalData > 5 && <ViewMore onClick={onViewMore} />
            : totalData > 10 && (
                <Pagination
                  currentPage={currentPage}
                  pagesQuantity={pagesQuantity}
                  offset={offset}
                  totalData={totalData}
                  scrollComponentId={scrollComponentId}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              ))}
      </TableContainer>
    );
  }
);

export const CodesTable = ({
  totalData,
  ...componentProps
}: CodesTableProps) => (
  <Box mt={12} mb={4}>
    <TableTitle
      title="Stored COdes"
      count={totalData ?? 0}
      helperText="This account stored the following codes"
    />
    <CodesTableBody totalData={totalData} {...componentProps} />
  </Box>
);
