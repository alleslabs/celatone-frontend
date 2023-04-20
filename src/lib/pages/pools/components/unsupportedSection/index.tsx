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

import { SuperfluidIcon } from "../../constant";
import { usePools } from "../../data";
import type { PoolFilterState } from "../../types";
import { FilterByPoolType } from "../FilterByPoolType";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { Order_By } from "lib/gql/graphql";
import { usePoolListCountByIsSupported } from "lib/services/poolService";
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
  const { data: totalData = 0, refetch: refetchCount } =
    usePoolListCountByIsSupported(false, "All", false, "");

  const [showNewest, setShowNewest] = useState(true);

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
        <Flex grow="2" gap={4}>
          <InputWithIcon
            placeholder="Search with Pool ID or Token ID"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("keyword", e.target.value)
            }
            size="lg"
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
                onChange={(e) => setValue("isSuperfluidOnly", e.target.checked)}
              />
              <FormLabel mb="0" cursor="pointer">
                <Text display="flex" gap={2} alignItems="center">
                  Show only
                  <Image boxSize={4} src={SuperfluidIcon} />
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
          <Flex gap="2" alignItems="center">
            <Text variant="body2" color="text.dark">
              Sort Pool ID:
            </Text>
            {showNewest ? (
              <Button
                variant="outline-gray"
                size="sm"
                pr="1"
                onClick={() => setShowNewest(!showNewest)}
              >
                Newest First
                <CustomIcon name="arrow-down" color="text.dark" />
              </Button>
            ) : (
              <Button
                variant="outline-gray"
                size="sm"
                pr="1"
                onClick={() => setShowNewest(!showNewest)}
              >
                Oldest First
                <CustomIcon name="arrow-up" color="text.dark" />
              </Button>
            )}
          </Flex>
          <Flex gap="2" alignItems="center">
            <Button variant="outline-gray" size="sm">
              Expand All
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <UnsupportedPoolList pools={pools} isLoading={isLoading} />
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
