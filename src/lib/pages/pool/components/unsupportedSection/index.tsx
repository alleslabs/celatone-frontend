import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { usePools } from "../../data";
import { CustomIcon } from "lib/components/icon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { Order_By } from "lib/gql/graphql";
import type { PoolTypeFilter } from "lib/types/pool";

import { UnsupportedPoolList } from "./UnsupportedPoolList";

interface UnsupportedSectionProp {
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
  totalData: number;
  refetchCount: () => void;
  scrollComponentId: string;
}
export const UnsupportedSection = ({
  poolType,
  isSuperfluidOnly,
  search,
  totalData,
  refetchCount,
  scrollComponentId,
}: UnsupportedSectionProp) => {
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
    poolType,
    isSuperfluidOnly,
    search,
    showNewest ? Order_By.Desc : Order_By.Asc,
    offset,
    pageSize
  );

  return (
    <>
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
