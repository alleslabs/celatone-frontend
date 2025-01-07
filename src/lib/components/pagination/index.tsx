import { Flex, Spacer } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo } from "react";

import { scrollToComponent, scrollToTop, scrollYPosition } from "lib/utils";

import { PageDetail } from "./PageDetail";
import { PageGoTo } from "./PageGoTo";
import { PageList } from "./PageList";
import { Paginator } from "./Paginator";

interface PaginationProps {
  currentPage: number;
  offset: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  pageSize: number;
  pagesQuantity: number;
  scrollComponentId?: string;
  totalData: number;
}
export const Pagination = ({
  currentPage,
  offset,
  onPageChange,
  onPageSizeChange,
  pageSize,
  pagesQuantity,
  scrollComponentId,
  totalData,
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

  const { lastDataInPage, lastPage, offsetData } = useMemo(() => {
    return {
      lastDataInPage:
        currentPage !== pagesQuantity ? pageSize * currentPage : totalData,
      lastPage: Math.ceil(totalData / pageSize),
      offsetData: offset + 1,
    };
  }, [currentPage, offset, pageSize, pagesQuantity, totalData]);

  return (
    <Paginator
      currentPage={currentPage}
      pagesQuantity={pagesQuantity}
      onPageChange={onPageChange}
    >
      <Flex
        gap={{ base: 4, md: 8 }}
        pt={6}
        w="full"
        direction={{ base: "column", md: "row" }}
      >
        <PageDetail
          lastDataInPage={lastDataInPage}
          pageSize={pageSize}
          offsetData={offsetData}
          onPageSizeChange={onPageSizeChange}
          totalData={totalData}
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
