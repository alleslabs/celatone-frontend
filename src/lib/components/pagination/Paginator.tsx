import type { ButtonProps } from "@chakra-ui/react";
import type { FC } from "react";
import type React from "react";

import type { IconKeys } from "../icon";

import { INITIAL_VALUES } from "./paginationData";
import { PaginatorProvider } from "./PaginatorProvider";

export type PaginatorProps = {
  activeStyles?: ButtonProps;
  children?: React.ReactNode;
  currentPage?: number;
  hoverIconLeft?: IconKeys;
  hoverIconRight?: IconKeys;
  innerLimit?: number;
  isDisabled?: boolean;
  normalStyles?: ButtonProps;
  onPageChange: (page: number) => void;
  outerLimit?: number;
  pagesQuantity?: number;
  separatorIcon?: IconKeys;
  separatorStyles?: ButtonProps;
};

export const Paginator: FC<PaginatorProps> = ({
  activeStyles = INITIAL_VALUES.activeStyles,
  children,
  currentPage = INITIAL_VALUES.currentPage,
  hoverIconLeft = INITIAL_VALUES.hoverIconLeft,
  hoverIconRight = INITIAL_VALUES.hoverIconRight,
  innerLimit = INITIAL_VALUES.innerLimit,
  isDisabled = INITIAL_VALUES.isDisabled,
  normalStyles = INITIAL_VALUES.normalStyles,
  onPageChange,
  outerLimit = INITIAL_VALUES.outerLimit,
  pagesQuantity = INITIAL_VALUES.pagesQuantity,
  separatorIcon = INITIAL_VALUES.separatorIcon,
  separatorStyles = INITIAL_VALUES.separatorStyles,
}) => (
  <PaginatorProvider
    activeStyles={activeStyles}
    currentPage={currentPage}
    innerLimit={innerLimit}
    isDisabled={isDisabled}
    pagesQuantity={pagesQuantity}
    hoverIconLeft={hoverIconLeft}
    hoverIconRight={hoverIconRight}
    normalStyles={normalStyles}
    onPageChange={onPageChange}
    outerLimit={outerLimit}
    separatorIcon={separatorIcon}
    separatorStyles={separatorStyles}
  >
    {children}
  </PaginatorProvider>
);
