import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { FC } from "react";
import { useContext } from "react";

import { PaginatorContext } from "./PaginatorProvider";

export const Previous: FC<ButtonProps> = ({ children, ...buttonProps }) => {
  const { actions, state } = useContext(PaginatorContext);

  const { changePage } = actions;
  const { currentPage, isDisabled } = state;
  const isFirst = currentPage === 1;

  const handlePreviousClick = () => {
    if (!isFirst) changePage(currentPage - 1);
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
