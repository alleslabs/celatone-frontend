import { Badge, Flex, Grid, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { NoContracts } from "../NoContracts";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { StyledTableHeader } from "lib/components/table";
import { useContractStore } from "lib/hooks";
import {
  useContractListByCodeId,
  useContractListCountByCodeId,
} from "lib/services/codeService";
import type { ContractInfo, Option } from "lib/types";

import { ContractTableRow } from "./ContractTableRow";

interface ContractTableProps {
  codeId: number;
}

export const ContractTable = observer(({ codeId }: ContractTableProps) => {
  const { getContractLocalInfo } = useContractStore();

  const { data: totalData = 0, refetch } = useContractListCountByCodeId(codeId);
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

  const { data: rawInstantiatedContracts } = useContractListByCodeId(
    codeId,
    offset,
    pageSize
  );
  const instantiatedContracts: Option<ContractInfo[]> =
    rawInstantiatedContracts?.map<ContractInfo>((contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    }));

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  const onPageChange = (nextPage: number) => {
    refetch();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetch();
    setPageSize(size);
  };

  if (!instantiatedContracts?.length) return <NoContracts />;

  // FIXME - might be a better way to scroll to table header
  const tableHeaderId = "contractTableHeader";
  const templateColumnsStyle =
    "150px minmax(250px, 1fr) 200px 150px minmax(250px, 300px) 70px";

  return (
    <>
      <Flex mb={6} align="center">
        <Heading as="h6" variant="h6" id={tableHeaderId}>
          Contract Instances
        </Heading>
        <Badge ml={2} variant="primary">
          {totalData}
        </Badge>
      </Flex>
      <Flex direction="column" overflowX="scroll">
        <Grid templateColumns={templateColumnsStyle}>
          <StyledTableHeader borderTopStyle="none">
            Contract Address
          </StyledTableHeader>
          <StyledTableHeader>Contract Name</StyledTableHeader>
          <StyledTableHeader>Tags</StyledTableHeader>
          <StyledTableHeader>Instantiator</StyledTableHeader>
          <StyledTableHeader>Timestamp</StyledTableHeader>
          <StyledTableHeader />
        </Grid>
        {instantiatedContracts?.map((contractInfo) => (
          <ContractTableRow
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
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={tableHeaderId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Flex>
    </>
  );
});
