import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Switch,
  Text,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { SUPERFLUID_ICON } from "../../constant";
import { usePools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { trackUseExpandAll, trackUseSort, trackUseToggle } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { Order_By } from "lib/gql/graphql";
import { useDebounce } from "lib/hooks";
import { usePoolListCountQuery } from "lib/services/poolService";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";
import { isPositiveInt } from "lib/utils";

import { UnsupportedPoolList } from "./UnsupportedPoolList";

interface UnsupportedSectionProp {
  scrollComponentId: string;
}
export const UnsupportedSection = ({
  scrollComponentId,
}: UnsupportedSectionProp) => {
  const { watch, setValue } = useForm<PoolFilterState>({
    defaultValues: {
      poolTypeValue: PoolType.ALL,
      keyword: "",
      isSuperfluidOnly: false,
    },
  });
  const { poolTypeValue, keyword, isSuperfluidOnly } = watch();
  const search = useMemo(
    () => (!keyword || isPositiveInt(keyword) ? keyword : `{"${keyword}"}`),
    [keyword]
  );
  const debouncedSearch = useDebounce(search);

  const { data: totalData = 0, refetch: refetchCount } = usePoolListCountQuery({
    isSupported: false,
    poolType: poolTypeValue,
    isSuperfluidOnly,
    search: debouncedSearch,
  });

  const [showNewest, setShowNewest] = useState(true);

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

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

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
    updateExpandedIndexes([]);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
    setExpandedIndexes([]);
  };

  const { pools, isLoading } = usePools(
    false,
    poolTypeValue,
    isSuperfluidOnly,
    debouncedSearch,
    showNewest ? Order_By.Desc : Order_By.Asc,
    offset,
    pageSize
  );

  return (
    <>
      <Flex alignItems="center" mb={12}>
        <Flex grow={2} gap={4}>
          <InputWithIcon
            placeholder="Search with Pool ID or Token ID"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
            size={{ base: "md", md: "lg" }}
            amptrackSection="unsupported-pool-list-search"
          />
          <FilterByPoolType
            initialSelected="All"
            setPoolTypeValue={(newVal: PoolTypeFilter) => {
              if (newVal === poolTypeValue) return;
              setValue("poolTypeValue", newVal);
            }}
          />
          <Flex minW="250px">
            <FormControl display="flex" alignItems="center" gap={2}>
              <Switch
                size="md"
                defaultChecked={isSuperfluidOnly}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setCurrentPage(1);
                  trackUseToggle("isSuperfluidOnly", isChecked);
                  setValue("isSuperfluidOnly", isChecked);
                }}
              />
              <FormLabel mb={0} cursor="pointer">
                <Text display="flex" gap={2} alignItems="center">
                  Show only
                  <Image boxSize={4} src={SUPERFLUID_ICON} />
                  <Text color="#ee64e8">Superfluid</Text>
                </Text>
              </FormLabel>
            </FormControl>
          </Flex>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" h="32px">
        <Flex gap={2} alignItems="center">
          <Heading as="h6" variant="h6">
            Pools with unsupported tokens
          </Heading>
          <Badge variant="gray" color="text.main" textColor="text.main">
            {totalData}
          </Badge>
        </Flex>
        <Flex gap={4}>
          <Flex gap={2} alignItems="center">
            <Text variant="body2" color="text.dark">
              Sort Pool ID:
            </Text>
            <Button
              variant="outline-gray"
              size="sm"
              pr={1}
              onClick={() => {
                const isDesc = !showNewest;
                trackUseSort("newest", isDesc ? "descending" : "ascending");
                setShowNewest(isDesc);
              }}
            >
              {showNewest ? "Newest First" : "Oldest First"}
              <CustomIcon
                name={showNewest ? "arrow-down" : "arrow-up"}
                color="text.dark"
              />
            </Button>
          </Flex>
          <Flex gap={2} alignItems="center">
            <Button
              variant="outline-gray"
              size="sm"
              rightIcon={
                <CustomIcon
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                  boxSize={3}
                />
              }
              onClick={() => {
                trackUseExpandAll(
                  expandedIndexes.length ? "collapse" : "expand"
                );
                setExpandedIndexes((prev) =>
                  !prev.length ? Array.from(Array(pageSize).keys()) : []
                );
              }}
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <UnsupportedPoolList
        pools={pools}
        isLoading={isLoading}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
      />
      {totalData > 10 && (
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
      )}
    </>
  );
};
