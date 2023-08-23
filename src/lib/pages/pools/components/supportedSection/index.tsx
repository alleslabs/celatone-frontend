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
import { matchSorter } from "match-sorter";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { SUPERFLUID_ICON } from "../../constant";
import { usePools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ToggleWithName } from "lib/components/ToggleWithName";
import { Order_By } from "lib/gql/graphql";
import {
  AmpTrackUseSort,
  AmpTrackUseToggle,
  AmpTrackUseView,
} from "lib/services/amplitude";
import { useAssetInfos } from "lib/services/assetService";
import { usePoolListCountQuery } from "lib/services/poolService";
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
  const { assetInfos } = useAssetInfos({ withPrices: true });

  const { watch, setValue } = useForm<PoolFilterState>({
    defaultValues: {
      poolTypeValue: PoolType.ALL,
      keyword: "",
      isSuperfluidOnly: false,
    },
  });
  const { poolTypeValue, keyword, isSuperfluidOnly } = watch();
  const search = useMemo(
    () =>
      !keyword || isPositiveInt(keyword) || !assetInfos
        ? keyword
        : `{${matchSorter(Object.values(assetInfos), keyword, {
            keys: ["id", "symbol"],
            threshold: matchSorter.rankings.CONTAINS,
          })
            .map((assetInfo) => `"${assetInfo.id}"`)
            .join(",")}}`,
    [assetInfos, keyword]
  );

  const { data: totalData = 0, refetch: refetchCount } = usePoolListCountQuery({
    isSupported: true,
    poolType: poolTypeValue,
    isSuperfluidOnly,
    search,
  });

  const [showNewest, setShowNewest] = useState(true);
  const [toggle, setToggle] = useState("percent-value");

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
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  const { pools, isLoading } = usePools(
    true,
    poolTypeValue,
    isSuperfluidOnly,
    search,
    showNewest ? Order_By.Desc : Order_By.Asc,
    offset,
    pageSize
  );

  return (
    <>
      <Flex alignItems="center" mb={12}>
        <Flex grow={2} gap={4}>
          <InputWithIcon
            placeholder="Search with Pool ID, Symbol or Token ID"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentPage(1);
              setValue("keyword", e.target.value);
            }}
            size="lg"
            action="supported-pool-list-search"
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
                  setCurrentPage(1);
                  AmpTrackUseToggle("isSuperfluidOnly", e.target.checked);
                  setValue("isSuperfluidOnly", e.target.checked);
                }}
              />
              <FormLabel mb="0" cursor="pointer">
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
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Heading as="h6" variant="h6">
            Pools
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
                AmpTrackUseSort(isDesc ? "descending" : "ascending");
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
            <Text variant="body2" color="text.dark">
              View asset allocation in:
            </Text>
            <ToggleWithName
              selectedValue={toggle}
              options={OPTIONS}
              selectOption={(value: string) => {
                AmpTrackUseView(value);
                setToggle(value);
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <SupportedPoolList pools={pools} isLoading={isLoading} mode={toggle} />
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
