import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { InstantiatedContractCard } from "lib/components/card/ContractCard";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useContractsByCodeId } from "lib/model/contract";
import { useContractListCountByCodeId } from "lib/services/contractService";
import type { ContractAddr } from "lib/types";

import { NoContracts } from "./NoContracts";

interface CodeContractsTableProps {
  codeId: number;
}

export const CodeContractsTable = observer(
  ({ codeId }: CodeContractsTableProps) => {
    const navigate = useInternalNavigate();
    const onRowSelect = (contract: ContractAddr) =>
      navigate({
        pathname: "/contracts/[contract]",
        query: { contract },
      });

    const { data: totalData, refetch } = useContractListCountByCodeId(codeId);
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

    const { contracts, isLoading } = useContractsByCodeId(
      codeId,
      offset,
      pageSize
    );

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

    const tableHeaderId = "contractTableHeader";
    const isMobile = useMobile();
    if (!contracts?.length) return <NoContracts />;
    return (
      <>
        <TableTitle
          title="Contract Instances"
          count={totalData ?? 0}
          id={tableHeaderId}
        />
        {isMobile ? (
          <Flex direction="column" gap={4} w="full" mt={4}>
            {contracts.map((contractInfo) => (
              <InstantiatedContractCard
                contractInfo={contractInfo}
                key={
                  contractInfo.name +
                  contractInfo.contractAddress +
                  contractInfo.description +
                  contractInfo.tags +
                  contractInfo.lists
                }
              />
            ))}
          </Flex>
        ) : (
          <ContractsTable
            contracts={contracts}
            isLoading={isLoading}
            emptyState={<NoContracts />}
            onRowSelect={onRowSelect}
          />
        )}
        {!!totalData && totalData > 10 && (
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
        )}
      </>
    );
  }
);
