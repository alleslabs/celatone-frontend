import { Button } from "@chakra-ui/react";

interface PageButtonProps {
  pageNumber: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export const PageButton = ({
  currentPage,
  onPageChange,
  pageNumber,
}: PageButtonProps) => {
  const isCurrentPage = pageNumber === currentPage;
  return (
    <Button
      _active={isCurrentPage ? {} : { background: "gray.600" }}
      _hover={
        isCurrentPage ? { cursor: "default" } : { background: "gray.700" }
      }
      minH={10}
      minW={10}
      size="sm"
      variant={isCurrentPage ? "primary" : "outline-gray"}
      w="fit-content"
      onClick={isCurrentPage ? undefined : () => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  );
};
