import { Button } from "@chakra-ui/react";

interface PageButtonProps {
  pageNumber: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export const PageButton = ({
  pageNumber,
  currentPage,
  onPageChange,
}: PageButtonProps) => {
  const isCurrentPage = pageNumber === currentPage;
  return (
    <Button
      bgColor={isCurrentPage ? "primary.dark" : "transparent"}
      border={isCurrentPage ? "2px solid" : "1px solid"}
      borderColor={isCurrentPage ? "primary.main" : "gray.700"}
      onClick={isCurrentPage ? undefined : () => onPageChange(pageNumber)}
      _hover={
        isCurrentPage ? { cursor: "default" } : { background: "gray.700" }
      }
      _active={isCurrentPage ? {} : { background: "gray.600" }}
      boxSize={10}
    >
      {pageNumber}
    </Button>
  );
};
