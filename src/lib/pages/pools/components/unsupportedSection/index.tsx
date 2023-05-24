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
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SUPERFLUID_ICON } from "../../constant";
import { usePools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { Order_By } from "lib/gql/graphql";
import {
  AmpTrackExpandAll,
  AmpTrackUseSort,
  AmpTrackUseToggle,
} from "lib/services/amplitude";
import { usePoolListCountQuery } from "lib/services/poolService";
import type { PoolTypeFilter } from "lib/types";

import { UnsupportedPoolList } from "./UnsupportedPoolList";

interface UnsupportedSectionProp {
  scrollComponentId: string;
}
export const UnsupportedSection = ({
  scrollComponentId,
}: UnsupportedSectionProp) => {
  const { watch, setValue } = useForm<PoolFilterState>({
    defaultValues: {
      poolTypeValue: "All",
      keyword: "",
      isSuperfluidOnly: false,
    },
  });
  const { poolTypeValue, keyword, isSuperfluidOnly } = watch();
  const { data: totalData = 0, refetch: refetchCount } = usePoolListCountQuery({
    isSupported: false,
    poolType: "All",
    isSuperfluidOnly: false,
    search: "",
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
    updateExpandedIndexes([]);
  };

  const { pools, isLoading } = usePools(
    false,
    poolTypeValue,
    isSuperfluidOnly,
    keyword,
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
            size="lg"
            action="unsupported-pool-list-search"
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
                  setCurrentPage(1);
                  AmpTrackUseToggle("isSuperfluidOnly", e.target.checked);
                  setValue("isSuperfluidOnly", e.target.checked);
                }}
              />
              <FormLabel mb={0} cursor="pointer">
                <Text display="flex" gap={2} alignItems="center">
                  Show only
                  <Image boxSize={4} src={SUPERFLUID_ICON} />
                  Superfluid
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
                AmpTrackUseSort(isDesc ? "Descending" : "Ascending");
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
              w="94px"
              size="sm"
              onClick={() =>
                setExpandedIndexes((prev) => {
                  const isExpand = !prev.length;
                  AmpTrackExpandAll(isExpand ? "expand" : "collapse");
                  return isExpand ? Array.from(Array(pageSize).keys()) : [];
                })
              }
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
    </>
  );
};
