import { Flex, Icon, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

import { scrollToComponent, scrollToTop, scrollYPosition } from "lib/utils";

import { Next } from "./Next";
import { Paginator } from "./Paginator";
import { Previous } from "./Previous";

interface PaginationProps {
  currentPage: number;
  pagesQuantity: number;
  offset: number;
  totalData: number;
  pageSize: number;
  scrollComponentId?: string;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
export const Pagination = ({
  currentPage,
  pagesQuantity,
  offset,
  totalData,
  pageSize,
  scrollComponentId,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  useEffect(() => {
    const windowPosition = scrollYPosition();
    if (windowPosition) {
      if (!scrollComponentId) {
        scrollToTop();
      } else {
        scrollToComponent(scrollComponentId);
      }
    }
  }, [currentPage, pageSize, scrollComponentId]);

  const { offsetData, lastDataInPage } = useMemo(() => {
    return {
      offsetData: offset + 1,
      lastDataInPage:
        currentPage !== pagesQuantity ? pageSize * currentPage : totalData,
    };
  }, [currentPage, offset, pageSize, pagesQuantity, totalData]);

  return (
    <Paginator
      currentPage={currentPage}
      pagesQuantity={pagesQuantity}
      onPageChange={onPageChange}
    >
      <Flex align="center" justify="center" w="full" px={4}>
        <Text variant="body3" color="text.dark">
          Items per page:
        </Text>
        <Select
          border="none"
          w="70px"
          fontSize="12px"
          focusBorderColor="none"
          icon={<TiArrowSortedDown />}
          iconSize="15px"
          cursor="pointer"
          onChange={onPageSizeChange}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <Text variant="body3" mx="30px">
          {`${offsetData} - ${lastDataInPage} of ${totalData}`}
        </Text>
        <Previous variant="unstyled" display="flex">
          <Icon as={MdKeyboardArrowLeft} w={5} h={5} color="pebble.600" />
        </Previous>
        <Next variant="unstyled" display="flex">
          <Icon as={MdKeyboardArrowRight} w={5} h={5} color="pebble.600" />
        </Next>
      </Flex>
    </Paginator>
  );
};
