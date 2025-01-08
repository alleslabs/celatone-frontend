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

import { useDerivedPools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { SuperfluidLabel } from "../SuperfluidLabel";
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

  const { setValue, watch } = useForm<PoolFilterState>({
    defaultValues: {
      isSuperfluidOnly: false,
      keyword: "",
      poolTypeValue: PoolType.ALL,
    },
  });
  const { isSuperfluidOnly, keyword, poolTypeValue } = watch();
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
        <Flex gap={4} grow={2}>
          <InputWithIcon
            size={{ base: "md", md: "lg" }}
            value={keyword}
            amptrackSection="supported-pool-list-search"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
            placeholder="Search with Pool ID, Symbol or Token ID"
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
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
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
      <SupportedPoolList isLoading={isLoading} mode={toggle} pools={pools} />
      {!!totalCount && totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          scrollComponentId={scrollComponentId}
          totalData={totalCount}
        />
      )}
    </>
  );
};
