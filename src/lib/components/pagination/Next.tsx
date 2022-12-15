import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { FC } from "react";
import { useContext } from "react";

import { PaginatorContext } from "lib/components/pagination/PaginatorProvider";

export const Next: FC<ButtonProps> = ({ children, ...buttonProps }) => {
  const { actions, state } = useContext(PaginatorContext);

  const { changePage } = actions;
  const { currentPage, pagesQuantity, isDisabled } = state;
  const isLast = pagesQuantity ? currentPage > pagesQuantity - 1 : true;

  const handleNextClick = () => {
    if (!isLast) changePage(currentPage + 1);
  };

  return (
    <Button
      aria-label="Next page"
      isDisabled={isLast || isDisabled}
      onClick={handleNextClick}
      pointerEvents={isDisabled ? "none" : "auto"}
      {...(isLast || isDisabled ? { "aria-disabled": true } : {})}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
