import { Flex, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCallback } from "react";

import { CustomIcon } from "../icon";
import { Next } from "./Next";
import { PageButton } from "./PageButton";
import { Previous } from "./Previous";

interface PageListProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (pageNumber: number) => void;
  pageSize: number;
}

export const PageList = ({
  currentPage,
  lastPage,
  onPageChange,
  pageSize,
}: PageListProps) => {
  const handlePageChange = useCallback(
    (pageNumber: number) => {
      track(AmpEvent.USE_PAGINATION_PAGE_BUTTON, {
        lastPage,
        page: pageNumber,
        pageSize,
      });
      onPageChange(pageNumber);
    },
    [lastPage, onPageChange, pageSize]
  );

  return (
    <Flex align="center" gap={1} justifyContent="center">
      <Previous display="flex" pageSize={pageSize} variant="unstyled">
        <CustomIcon color="text.dark" name="chevron-left" />
      </Previous>
      {currentPage > 1 && (
        <>
          <PageButton
            currentPage={currentPage}
            pageNumber={1}
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
                currentPage={currentPage}
                pageNumber={currentPage - 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
      <PageButton
        currentPage={currentPage}
        pageNumber={currentPage}
        onPageChange={handlePageChange}
      />
      {currentPage < lastPage && (
        <>
          {currentPage < lastPage - 1 && (
            <>
              <PageButton
                currentPage={currentPage}
                pageNumber={currentPage + 1}
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
            currentPage={currentPage}
            pageNumber={lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <Next display="flex" pageSize={pageSize} variant="unstyled">
        <CustomIcon color="text.dark" name="chevron-right" />
      </Next>
    </Flex>
  );
};
