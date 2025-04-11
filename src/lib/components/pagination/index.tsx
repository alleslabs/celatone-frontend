import type { ChangeEvent } from "react";

import { Flex, Spacer } from "@chakra-ui/react";
import { scrollToComponent, scrollToTop, scrollYPosition } from "lib/utils";
import { useEffect, useMemo } from "react";

import { PageDetail } from "./PageDetail";
import { PageGoTo } from "./PageGoTo";
import { PageList } from "./PageList";
import { Paginator } from "./Paginator";

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

  const { offsetData, lastDataInPage, lastPage } = useMemo(() => {
    return {
      offsetData: offset + 1,
      lastDataInPage:
        currentPage !== pagesQuantity ? pageSize * currentPage : totalData,
      lastPage: Math.ceil(totalData / pageSize),
    };
  }, [currentPage, offset, pageSize, pagesQuantity, totalData]);

  return (
    <Paginator
      currentPage={currentPage}
      pagesQuantity={pagesQuantity}
      onPageChange={onPageChange}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 8 }}
        pt={6}
        w="full"
      >
        <PageDetail
          lastDataInPage={lastDataInPage}
          offsetData={offsetData}
          pageSize={pageSize}
          totalData={totalData}
          onPageSizeChange={onPageSizeChange}
        />
        <Spacer />
        <PageList
          currentPage={currentPage}
          lastPage={lastPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
        <PageGoTo lastPage={lastPage} onPageChange={onPageChange} />
      </Flex>
    </Paginator>
  );
};
