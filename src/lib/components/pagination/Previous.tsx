import type { ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Button } from "@chakra-ui/react";
import { trackUsePaginationNavigate } from "lib/amplitude";
import { useContext } from "react";

import { PaginatorContext } from "./PaginatorProvider";

interface PreviousProps extends ButtonProps {
  children: ReactNode;
  pageSize: number;
}
export const Previous = ({
  children,
  pageSize,
  ...buttonProps
}: PreviousProps) => {
  const { actions, state } = useContext(PaginatorContext);

  const { changePage } = actions;
  const { currentPage, isDisabled } = state;
  const isFirst = currentPage === 1;

  const handlePreviousClick = () => {
    const currPage = currentPage - 1;
    if (!isFirst) changePage(currPage);
    trackUsePaginationNavigate("previous", pageSize, currPage);
  };

  return (
    <Button
      aria-label="Previous page"
      isDisabled={isFirst || isDisabled}
      pointerEvents={isDisabled ? "none" : "auto"}
      onClick={handlePreviousClick}
      {...(isFirst || isDisabled ? { "aria-disabled": true } : {})}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
