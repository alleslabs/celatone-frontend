import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { usePools } from "../../data";
import { CustomIcon } from "lib/components/icon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ToggleWithName } from "lib/components/ToggleWithName";
import { Order_By } from "lib/gql/graphql";
import type { PoolTypeFilter } from "lib/types";

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
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
  totalData: number;
  refetchCount: () => void;
  scrollComponentId: string;
}

export const SupportedSection = ({
  poolType,
  isSuperfluidOnly,
  search,
  totalData,
  refetchCount,
  scrollComponentId,
}: SupportedSectionProp) => {
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
    poolType,
    isSuperfluidOnly,
    search,
    showNewest ? Order_By.Desc : Order_By.Asc,
    offset,
    pageSize
  );

  return (
    <>
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
          <Flex gap="2" alignItems="center">
            <Text variant="body2" color="text.dark">
              Sort Pool ID:
            </Text>
            <Button
              variant="outline-gray"
              size="sm"
              pr="1"
              onClick={() => setShowNewest(!showNewest)}
            >
              {showNewest ? "Newest First" : "Oldest First"}
              <CustomIcon
                name={showNewest ? "arrow-down" : "arrow-up"}
                color="text.dark"
              />
            </Button>
          </Flex>
          <Flex gap="2" alignItems="center">
            <Text variant="body2" color="text.dark">
              View asset allocation in:
            </Text>
            <ToggleWithName
              selectedValue={toggle}
              options={OPTIONS}
              selectOption={(value: string) => setToggle(value)}
            />
          </Flex>
        </Flex>
      </Flex>
      <SupportedPoolList pools={pools} isLoading={isLoading} mode={toggle} />
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
