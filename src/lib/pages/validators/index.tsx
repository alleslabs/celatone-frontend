import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useDebounce } from "lib/hooks";
import { useValidators } from "lib/services/validatorService";

import { ActiveFilter, OrderSelect } from "./components";
import { ValidatorsTable } from "./components/validators-table";
import { ValidatorOrder } from "./types";

const Validators = () => {
  const router = useRouter();
  const isMobile = useMobile();
  useGovConfig({ shouldRedirect: true });

  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(ValidatorOrder.VotingPower);
  const [isDesc, setIsDesc] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

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
      pageSize: 100,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isFetching: isLoading } = useValidators(
    pageSize,
    offset,
    isActive,
    order,
    isDesc,
    debouncedSearch,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_VALIDATORS);
  }, [router.isReady]);

  useEffect(() => {
    setCurrentPage(1);
    setPageSize(100);
  }, [isActive, order, isDesc, debouncedSearch, setCurrentPage, setPageSize]);

  const scrollComponentId = "validator-table-header";
  return (
    <>
      <PageHeaderContainer bgColor="success.background">
        <PageHeader
          title="Validators"
          subtitle="This page displays all validators on this network"
          docHref="introduction/block-explorer#validators"
        />
        <Flex
          direction={{ base: "column", md: "row" }}
          align="end"
          gap={{ base: "18px", md: "8px" }}
          w="full"
        >
          <ActiveFilter
            isActive={isActive}
            setIsActive={setIsActive}
            activeCount={data?.metadata.activeCount}
            inactiveCount={data?.metadata.inactiveCount}
          />
          {isMobile && (
            <OrderSelect
              order={order}
              setOrder={setOrder}
              isDesc={isDesc}
              setIsDesc={setIsDesc}
            />
          )}
          <InputWithIcon
            size="lg"
            placeholder={
              isMobile
                ? "Search with name or address ..."
                : "Search with validator name or validator address ..."
            }
            value={search}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearch(newValue);
            }}
            amptrackSection="validator-list-search"
          />
        </Flex>
      </PageHeaderContainer>
      <PageContainer>
        <ValidatorsTable
          data={data}
          isLoading={isLoading}
          isActive={isActive}
          order={order}
          setOrder={setOrder}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          scrollComponentId={scrollComponentId}
        />
        {data && data.total > 10 && (
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
      </PageContainer>
    </>
  );
};

export default Validators;
