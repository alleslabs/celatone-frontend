import type { ButtonProps } from "@chakra-ui/react";
import type { FC } from "react";
import type React from "react";

import type { IconKeys } from "../icon";

import { INITIAL_VALUES } from "./paginationData";
import { PaginatorProvider } from "./PaginatorProvider";

export type PaginatorProps = {
  children?: React.ReactNode;
  pagesQuantity?: number;
  normalStyles?: ButtonProps;
  activeStyles?: ButtonProps;
  separatorStyles?: ButtonProps;
  currentPage?: number;
  innerLimit?: number;
  outerLimit?: number;
  separatorIcon?: IconKeys;
  hoverIconRight?: IconKeys;
  hoverIconLeft?: IconKeys;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
};

export const Paginator: FC<PaginatorProps> = ({
  children,
  pagesQuantity = INITIAL_VALUES.pagesQuantity,
  normalStyles = INITIAL_VALUES.normalStyles,
  activeStyles = INITIAL_VALUES.activeStyles,
  separatorStyles = INITIAL_VALUES.separatorStyles,
  isDisabled = INITIAL_VALUES.isDisabled,
  innerLimit = INITIAL_VALUES.innerLimit,
  separatorIcon = INITIAL_VALUES.separatorIcon,
  outerLimit = INITIAL_VALUES.outerLimit,
  hoverIconLeft = INITIAL_VALUES.hoverIconLeft,
  hoverIconRight = INITIAL_VALUES.hoverIconRight,
  currentPage = INITIAL_VALUES.currentPage,
  onPageChange,
}) => (
  <PaginatorProvider
    activeStyles={activeStyles}
    currentPage={currentPage}
    hoverIconLeft={hoverIconLeft}
    hoverIconRight={hoverIconRight}
    innerLimit={innerLimit}
    isDisabled={isDisabled}
    normalStyles={normalStyles}
    onPageChange={onPageChange}
    outerLimit={outerLimit}
    pagesQuantity={pagesQuantity}
    separatorIcon={separatorIcon}
    separatorStyles={separatorStyles}
  >
    {children}
  </PaginatorProvider>
);
