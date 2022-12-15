import { Flex, Icon, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

import { Next } from "./Next";
import { Paginator } from "./Paginator";
import { Previous } from "./Previous";

interface PaginationProps {
  onPageChange: (pageNumber: number) => void;
  handlePageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  currentPage: number;
  pagesQuantity: number;
  offset: number;
  totalData?: number;
  pageSize: number;
}
export const Pagination = ({
  onPageChange,
  currentPage,
  pagesQuantity,
  handlePageSizeChange,
  offset,
  totalData,
  pageSize,
}: PaginationProps) => {
  return (
    <Paginator
      onPageChange={onPageChange}
      currentPage={currentPage}
      pagesQuantity={pagesQuantity}
    >
      <Flex align="center" justify="center" w="full" p={4}>
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
          onChange={handlePageSizeChange}
          cursor="pointer"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <Text variant="body3" mx="30px">
          {offset + 1} -{" "}
          {currentPage !== pagesQuantity && totalData
            ? pageSize * currentPage
            : totalData}{" "}
          of {totalData}
        </Text>
        <Previous variant="unstyled" display="flex">
          <Icon as={MdKeyboardArrowLeft} w={5} h={5} color="gray.600" />
        </Previous>
        <Next variant="unstyled" display="flex">
          <Icon as={MdKeyboardArrowRight} w={5} h={5} color="gray.600" />
        </Next>
      </Flex>
    </Paginator>
  );
};
