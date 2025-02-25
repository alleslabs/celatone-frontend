import { Flex, Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";

import { Next } from "./Next";
import { PageButton } from "./PageButton";
import { Previous } from "./Previous";
import { CustomIcon } from "../icon";

interface PageListProps {
  pageSize: number;
  currentPage: number;
  lastPage: number;
  onPageChange: (pageNumber: number) => void;
}

export const PageList = ({
  pageSize,
  currentPage,
  lastPage,
  onPageChange,
}: PageListProps) => {
  const handlePageChange = useCallback(
    (pageNumber: number) => {
      track(AmpEvent.USE_PAGINATION_PAGE_BUTTON, {
        page: pageNumber,
        lastPage,
        pageSize,
      });
      onPageChange(pageNumber);
    },
    [lastPage, onPageChange, pageSize]
  );

  return (
    <Flex align="center" gap={1} justifyContent="center">
      <Previous pageSize={pageSize} variant="unstyled" display="flex">
        <CustomIcon name="chevron-left" color="text.dark" />
      </Previous>
      {currentPage > 1 && (
        <>
          <PageButton
            pageNumber={1}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          {currentPage > 2 && (
            <>
              {currentPage > 3 && (
                <Text mx="2px" px={2}>
                  ...
                </Text>
              )}
              <PageButton
                pageNumber={currentPage - 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
      <PageButton
        pageNumber={currentPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {currentPage < lastPage && (
        <>
          {currentPage < lastPage - 1 && (
            <>
              <PageButton
                pageNumber={currentPage + 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              {currentPage < lastPage - 2 && (
                <Text mx="2px" px={2}>
                  ...
                </Text>
              )}
            </>
          )}
          <PageButton
            pageNumber={lastPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <Next pageSize={pageSize} variant="unstyled" display="flex">
        <CustomIcon name="chevron-right" color="text.dark" />
      </Next>
    </Flex>
  );
};
