import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Text,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useDerivedPools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { SuperfluidLabel } from "../SuperfluidLabel";
import { trackUseExpandAll, trackUseSort, trackUseToggle } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useDebounce } from "lib/hooks";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";

import { UnsupportedPoolList } from "./UnsupportedPoolList";

interface UnsupportedSectionProp {
  scrollComponentId: string;
}
export const UnsupportedSection = ({
  scrollComponentId,
}: UnsupportedSectionProp) => {
  const { setValue, watch } = useForm<PoolFilterState>({
    defaultValues: {
      isSuperfluidOnly: false,
      keyword: "",
      poolTypeValue: PoolType.ALL,
    },
  });
  const { isSuperfluidOnly, keyword, poolTypeValue } = watch();
  const search = useDebounce(keyword);

  const [showNewest, setShowNewest] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

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

  const { isLoading, pools, totalCount } = useDerivedPools(
    pageSize,
    offset,
    false,
    poolTypeValue,
    isSuperfluidOnly,
    search,
    showNewest,
    ({ total }) => setTotalData(total)
  );

  return (
    <>
      <Flex alignItems="center" mb={12}>
        <Flex gap={4} grow={2}>
          <InputWithIcon
            size={{ base: "md", md: "lg" }}
            value={keyword}
            amptrackSection="unsupported-pool-list-search"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
            placeholder="Search with Pool ID or Token ID"
          />
          <FilterByPoolType
            initialSelected="All"
            setPoolTypeValue={(newVal: PoolTypeFilter) => {
              if (newVal === poolTypeValue) return;
              setValue("poolTypeValue", newVal);
            }}
          />
          <Flex minW="250px">
            <FormControl alignItems="center" display="flex" gap={2}>
              <Switch
                defaultChecked={isSuperfluidOnly}
                size="md"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setCurrentPage(1);
                  trackUseToggle("isSuperfluidOnly", isChecked);
                  setValue("isSuperfluidOnly", isChecked);
                }}
              />
              <FormLabel mb={0} cursor="pointer">
                <Text alignItems="center" display="flex" gap={2}>
                  Show only
                  <SuperfluidLabel />
                </Text>
              </FormLabel>
            </FormControl>
          </Flex>
        </Flex>
      </Flex>
      <Flex alignItems="center" h="32px" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Heading as="h6" variant="h6">
            Pools with unsupported tokens
          </Heading>
          {totalCount && (
            <Badge variant="gray" color="text.main" textColor="text.main">
              {totalCount}
            </Badge>
          )}
        </Flex>
        <Flex gap={4}>
          <Flex alignItems="center" gap={2}>
            <Text variant="body2" color="text.dark">
              Sort Pool ID:
            </Text>
            <Button
              pr={1}
              size="sm"
              variant="outline-gray"
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
          <Flex alignItems="center" gap={2}>
            <Button
              size="sm"
              variant="outline-gray"
              onClick={() => {
                trackUseExpandAll(
                  expandedIndexes.length ? "collapse" : "expand"
                );
                setExpandedIndexes((prev) =>
                  !prev.length ? Array.from(Array(pageSize).keys()) : []
                );
              }}
              rightIcon={
                <CustomIcon
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                  boxSize={3}
                />
              }
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <UnsupportedPoolList
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        isLoading={isLoading}
        pools={pools}
      />
      {totalCount && totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
            updateExpandedIndexes([]);
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
            setExpandedIndexes([]);
          }}
          scrollComponentId={scrollComponentId}
          totalData={totalCount}
        />
      )}
    </>
  );
};
