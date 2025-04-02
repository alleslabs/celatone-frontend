import type { ButtonProps } from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { trackUsePaginationNavigate } from "lib/amplitude";
import { useContext } from "react";

import { PaginatorContext } from "./PaginatorProvider";

interface NextProps extends ButtonProps {
  children: React.ReactNode;
  pageSize: number;
}

export const Next = ({ children, pageSize, ...buttonProps }: NextProps) => {
  const { actions, state } = useContext(PaginatorContext);

  const { changePage } = actions;
  const { currentPage, pagesQuantity, isDisabled } = state;
  const isLast = pagesQuantity ? currentPage > pagesQuantity - 1 : true;

  const handleNextClick = () => {
    const currPage = currentPage + 1;
    if (!isLast) changePage(currPage);
    trackUsePaginationNavigate("next", pageSize, currPage);
  };

  return (
    <Button
      aria-label="Next page"
      isDisabled={isLast || isDisabled}
      pointerEvents={isDisabled ? "none" : "auto"}
      onClick={handleNextClick}
      {...(isLast || isDisabled ? { "aria-disabled": true } : {})}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
