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
import { matchSorter } from "match-sorter";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { trackUseSort, trackUseToggle, trackUseView } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ToggleWithName } from "lib/components/ToggleWithName";
import { useDebounce } from "lib/hooks";
import { useAssetInfos } from "lib/services/assetService";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";
import { isPositiveInt } from "lib/utils";

import { SupportedPoolList } from "./SupportedPoolList";
import { useDerivedPools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { SuperfluidLabel } from "../SuperfluidLabel";

const OPTIONS = [
  {
    label: "%Value",
    value: "percent-value",
  },
  {
    label: "Amount",
    value: "amount",
  },
];

interface SupportedSectionProp {
  scrollComponentId: string;
}

export const SupportedSection = ({
  scrollComponentId,
}: SupportedSectionProp) => {
  const { data: assetInfos } = useAssetInfos({ withPrices: true });

  const { watch, setValue } = useForm<PoolFilterState>({
    defaultValues: {
      poolTypeValue: PoolType.ALL,
      keyword: "",
      isSuperfluidOnly: false,
    },
  });
  const { poolTypeValue, keyword, isSuperfluidOnly } = watch();
  const debouncedKeyword = useDebounce(keyword);
  const search = useMemo(
    () =>
      !debouncedKeyword || isPositiveInt(debouncedKeyword) || !assetInfos
        ? debouncedKeyword
        : `${matchSorter(Object.values(assetInfos), debouncedKeyword, {
            keys: ["id", "symbol"],
            threshold: matchSorter.rankings.CONTAINS,
          })
            .map((assetInfo) => assetInfo.id)
            .join(",")}`,
    [assetInfos, debouncedKeyword]
  );

  const [showNewest, setShowNewest] = useState(true);
  const [toggle, setToggle] = useState("percent-value");

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
    true,
    poolTypeValue,
    isSuperfluidOnly,
    search,
    showNewest,
    ({ total }) => setTotalData(total)
  );

  return (
    <>
      <Flex alignItems="center" mb={12}>
        <Flex grow={2} gap={4}>
          <InputWithIcon
            placeholder="Search with pool ID, symbol or token ID"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
            size={{ base: "md", md: "lg" }}
            amptrackSection="supported-pool-list-search"
          />
          <FilterByPoolType
            initialSelected="All"
            setPoolTypeValue={(newVal: PoolTypeFilter) => {
              setCurrentPage(1);
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
                  <SuperfluidLabel />
                </Text>
              </FormLabel>
            </FormControl>
          </Flex>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Heading as="h6" variant="h6">
            Pools
          </Heading>
          {totalCount && (
            <Badge variant="gray" color="text.main" textColor="text.main">
              {totalCount}
            </Badge>
          )}
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
              {showNewest ? "Newest first" : "Oldest first"}
              <CustomIcon
                name={showNewest ? "arrow-down" : "arrow-up"}
                color="text.dark"
              />
            </Button>
          </Flex>
          <Flex gap={2} alignItems="center">
            <Text variant="body2" color="text.dark">
              View asset allocation in:
            </Text>
            <ToggleWithName
              selectedValue={toggle}
              options={OPTIONS}
              selectOption={(value: string) => {
                trackUseView(value);
                setToggle(value);
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <SupportedPoolList pools={pools} isLoading={isLoading} mode={toggle} />
      {!!totalCount && totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalCount}
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
    </>
  );
};
