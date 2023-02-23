import { Box, Flex, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableContainer, TableHeader } from "lib/components/table";
import { ContractsTableRow } from "lib/components/table/contracts/ContractsTableRow";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { useContractsAdmin } from "lib/pages/account-details/data";
import type { HumanAddr, Option } from "lib/types";

interface ContractsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const ContractsTableBody = observer(
  ({
    walletAddress,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: ContractsTableProps) => {
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
    const { contracts, isLoading } = useContractsAdmin(
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
      "150px minmax(250px, 1fr) 200px 150px minmax(250px, 300px) 70px";

    if (isLoading) return <Loading />;
    if (!contracts?.length)
      return (
        <Flex
          py="64px"
          direction="column"
          borderY="1px solid"
          borderColor="pebble.700"
        >
          <EmptyState message="This account does not have any admin access for any contracts." />
        </Flex>
      );
    return (
      <TableContainer overflow="visible">
        <Grid templateColumns={templateColumnsStyle} minW="min-content">
          <TableHeader borderTopStyle="none">Contract Address</TableHeader>
          <TableHeader>Contract Name</TableHeader>
          <TableHeader>Tags</TableHeader>
          <TableHeader>Instantiator</TableHeader>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader />
        </Grid>
        {contracts.map((contractInfo) => (
          <ContractsTableRow
            key={
              contractInfo.name +
              contractInfo.contractAddress +
              contractInfo.description +
              contractInfo.tags +
              contractInfo.lists
            }
            contractInfo={contractInfo}
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

export const AdminContractsTable = ({
  totalData,
  ...componentProps
}: ContractsTableProps) => (
  <Box mt={12} mb={4}>
    <TableTitle
      title="Contract Admins"
      count={totalData ?? 0}
      helperText="This account is the admin for following contracts"
    />
    <ContractsTableBody totalData={totalData} {...componentProps} />
  </Box>
);
