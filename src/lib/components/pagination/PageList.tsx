import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

import { Next } from "./Next";
import { PageButton } from "./PageButton";
import { Previous } from "./Previous";

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
}: PageListProps) => (
  <Flex align="center" gap={1}>
    <Previous pageSize={pageSize} variant="unstyled" display="flex">
      <CustomIcon name="chevron-left" color="text.dark" />
    </Previous>
    {currentPage > 1 && (
      <>
        <PageButton
          pageNumber={1}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        {currentPage > 2 && (
          <>
            {currentPage > 3 && (
              <Text mx="2px" px="7px">
                ...
              </Text>
            )}
            <PageButton
              pageNumber={currentPage - 1}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </>
    )}
    <PageButton
      pageNumber={currentPage}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
    {currentPage < lastPage && (
      <>
        {currentPage < lastPage - 1 && (
          <>
            <PageButton
              pageNumber={currentPage + 1}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
            {currentPage < lastPage - 2 && (
              <Text mx="2px" px="7px">
                ...
              </Text>
            )}
          </>
        )}
        <PageButton
          pageNumber={lastPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </>
    )}
    <Next pageSize={pageSize} variant="unstyled" display="flex">
      <CustomIcon name="chevron-right" color="text.dark" />
    </Next>
  </Flex>
);
