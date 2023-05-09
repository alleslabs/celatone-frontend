import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { FC } from "react";
import { useContext } from "react";

import { AmpTrackPaginationNavigate } from "lib/services/amplitude";

import { PaginatorContext } from "./PaginatorProvider";

export const Next: FC<ButtonProps> = ({ children, ...buttonProps }) => {
  const { actions, state } = useContext(PaginatorContext);

  const { changePage } = actions;
  const { currentPage, pagesQuantity, isDisabled } = state;
  const isLast = pagesQuantity ? currentPage > pagesQuantity - 1 : true;

  const handleNextClick = () => {
    AmpTrackPaginationNavigate("next");
    if (!isLast) changePage(currentPage + 1);
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
