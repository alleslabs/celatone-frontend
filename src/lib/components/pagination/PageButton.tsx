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
      variant={isCurrentPage ? "primary" : "outline-gray"}
      onClick={isCurrentPage ? undefined : () => onPageChange(pageNumber)}
      _hover={
        isCurrentPage ? { cursor: "default" } : { background: "gray.700" }
      }
      _active={isCurrentPage ? {} : { background: "gray.600" }}
      minH={10}
      minW={10}
      w="fit-content"
      size="sm"
    >
      {pageNumber}
    </Button>
  );
};
