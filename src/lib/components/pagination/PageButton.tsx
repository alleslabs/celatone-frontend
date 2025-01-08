import { Button } from "@chakra-ui/react";

interface PageButtonProps {
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  pageNumber: number;
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
      minH={10}
      minW={10}
      size="sm"
      variant={isCurrentPage ? "primary" : "outline-gray"}
      w="fit-content"
      _hover={
        isCurrentPage ? { cursor: "default" } : { background: "gray.700" }
      }
      onClick={isCurrentPage ? undefined : () => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  );
};
