import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import type { ReactNode } from "react";

import { AmpTrackPaginationNavigate } from "lib/services/amplitude";

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
    AmpTrackPaginationNavigate("previous", pageSize, currPage);
  };

  return (
    <Button
      aria-label="Previous page"
      isDisabled={isFirst || isDisabled}
      onClick={handlePreviousClick}
      pointerEvents={isDisabled ? "none" : "auto"}
      {...(isFirst || isDisabled ? { "aria-disabled": true } : {})}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
