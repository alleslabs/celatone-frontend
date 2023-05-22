import { Flex, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
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
          cursor="pointer"
          value={pageSize}
          onChange={(e) => {
            AmpTrack(AmpEvent.USE_PAGINATION_PAGE_SIZE, {
              pageSize: e.target.value,
            });
            onPageSizeChange(e);
          }}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <CustomIcon name="chevron-down" color="gray.600" />
        </Select>
        <Text variant="body3" mx="30px">
          {`${offsetData.toLocaleString()} - ${lastDataInPage.toLocaleString()} of ${totalData.toLocaleString()}`}
        </Text>
        <Previous pageSize={pageSize} variant="unstyled" display="flex">
          <CustomIcon name="chevron-left" color="text.dark" />
        </Previous>
        <Next pageSize={pageSize} variant="unstyled" display="flex">
          <CustomIcon name="chevron-right" color="text.dark" />
        </Next>
      </Flex>
    </Paginator>
  );
};
