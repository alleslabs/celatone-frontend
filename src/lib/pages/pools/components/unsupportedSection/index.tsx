import type { PoolTypeFilter } from "lib/types";
import type { ChangeEvent } from "react";

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
import { trackUseExpandAll, trackUseSort, trackUseToggle } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useDebounce } from "lib/hooks";
import { PoolType } from "lib/types";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { PoolFilterState } from "../../types";

import { useDerivedPools } from "../../data";
import { FilterByPoolType } from "../FilterByPoolType";
import { SuperfluidLabel } from "../SuperfluidLabel";
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
  const search = useDebounce(keyword);

  const [showNewest, setShowNewest] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

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

  const { pools, totalCount, isLoading } = useDerivedPools(
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
            amptrackSection="unsupported-pool-list-search"
            placeholder="Search with Pool ID or Token ID"
            size={{ base: "md", md: "lg" }}
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
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
              <FormLabel cursor="pointer" mb={0}>
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
            <Badge color="text.main" textColor="text.main" variant="gray">
              {totalCount}
            </Badge>
          )}
        </Flex>
        <Flex gap={4}>
          <Flex alignItems="center" gap={2}>
            <Text color="text.dark" variant="body2">
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
                color="text.dark"
                name={showNewest ? "arrow-down" : "arrow-up"}
              />
            </Button>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Button
              rightIcon={
                <CustomIcon
                  boxSize={3}
                  name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                />
              }
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
            >
              {expandedIndexes.length ? "Collapse All" : "Expand All"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <UnsupportedPoolList
        expandedIndexes={expandedIndexes}
        isLoading={isLoading}
        pools={pools}
        updateExpandedIndexes={updateExpandedIndexes}
      />
      {totalCount && totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          scrollComponentId={scrollComponentId}
          totalData={totalCount}
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
        />
      )}
    </>
  );
};
