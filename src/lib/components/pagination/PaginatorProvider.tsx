import type { ButtonProps } from "@chakra-ui/react";
import {
  useState,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type React from "react";
import type { FC, SetStateAction, Dispatch } from "react";

import type { IconKeys } from "../icon";
import { isDecimalNumber } from "lib/utils";

import { INITIAL_VALUES } from "./paginationData";

export type PaginatorContextValues = {
  state: {
    currentPage: number;
    pagesQuantity?: number;
    outerLimit: number;
    activeStyles: ButtonProps;
    hoverIconRight?: IconKeys;
    hoverIconLeft?: IconKeys;
    separatorStyles: ButtonProps;
    normalStyles: ButtonProps;
    innerLimit: number;
    separatorIcon?: IconKeys;
    isDisabled: boolean;
  };
  actions: {
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setIsDisabled: Dispatch<SetStateAction<boolean>>;
    changePage: (page: number) => void;
  };
};

export const PaginatorContext = createContext<PaginatorContextValues>({
  state: {
    currentPage: INITIAL_VALUES.currentPage,
    activeStyles: INITIAL_VALUES.activeStyles,
    normalStyles: INITIAL_VALUES.normalStyles,
    separatorStyles: INITIAL_VALUES.separatorStyles,
    hoverIconRight: INITIAL_VALUES.hoverIconRight,
    hoverIconLeft: INITIAL_VALUES.hoverIconLeft,
    innerLimit: INITIAL_VALUES.innerLimit,
    outerLimit: INITIAL_VALUES.outerLimit,
    pagesQuantity: INITIAL_VALUES.pagesQuantity,
    separatorIcon: INITIAL_VALUES.separatorIcon,
    isDisabled: INITIAL_VALUES.isDisabled,
  },
  actions: {
    setCurrentPage: () => null,
    setIsDisabled: () => null,
    changePage: () => null,
  },
});

type PaginatorProviderProps = {
  children?: React.ReactNode;

  pagesQuantity?: number;
  normalStyles: ButtonProps;
  activeStyles: ButtonProps;
  hoverIconRight?: IconKeys;
  separatorStyles: ButtonProps;
  hoverIconLeft?: IconKeys;
  innerLimit: number;
  currentPage: number;
  outerLimit: number;
  separatorIcon?: IconKeys;
  onPageChange: (page: number) => void;
  isDisabled: boolean;
};

export const PaginatorProvider: FC<PaginatorProviderProps> = ({
  children,
  pagesQuantity: pagesQuantityProp,
  currentPage: currentPageProp,
  innerLimit: innerLimitProp,
  outerLimit: outerLimitProp,
  separatorStyles: separatorStylesProp,
  normalStyles: normalStylesProp,
  activeStyles: activeStylesProp,
  separatorIcon: separatorIconProp,
  hoverIconRight: hoverIconRightProp,
  hoverIconLeft: hoverIconLeftProp,
  onPageChange,
  isDisabled: isDisabledProp,
}) => {
  // react hooks
  const [currentPage, setCurrentPage] = useState<number>(
    INITIAL_VALUES.currentPage
  );
  const [isDisabled, setIsDisabled] = useState(INITIAL_VALUES.isDisabled);

  const activeStyles = useMemo(() => activeStylesProp, [activeStylesProp]);
  const separatorStyles = useMemo(
    () => separatorStylesProp,
    [separatorStylesProp]
  );
  const innerLimit = useMemo(() => innerLimitProp, [innerLimitProp]);
  const pagesQuantity = useMemo(() => pagesQuantityProp, [pagesQuantityProp]);
  const outerLimit = useMemo(() => outerLimitProp, [outerLimitProp]);
  const normalStyles = useMemo(() => normalStylesProp, [normalStylesProp]);
  const separatorIcon = useMemo(() => separatorIconProp, [separatorIconProp]);
  const hoverIconLeft = useMemo(() => hoverIconLeftProp, [hoverIconLeftProp]);
  const hoverIconRight = useMemo(
    () => hoverIconRightProp,
    [hoverIconRightProp]
  );

  // effects
  useEffect(() => {
    setIsDisabled(isDisabledProp);
  }, [isDisabledProp]);

  useEffect(() => {
    if (isDecimalNumber(currentPageProp)) {
      // eslint-disable-next-line no-console
      console.error(
        `Chakra paginator -> passed down currentPage has to be a whole number`
      );

      return;
    }

    if (!pagesQuantity) {
      return;
    }

    if (currentPageProp > pagesQuantity) {
      // eslint-disable-next-line no-console
      console.error(
        `Chakra paginator -> passed down currentPage can't be higher than pagesQuantity`
      );

      return;
    }

    if (currentPageProp < 1) {
      // eslint-disable-next-line no-console
      console.error(
        `Chakra paginator -> passed down currentPage can't be lower than 1`
      );

      return;
    }

    if (currentPageProp && currentPageProp !== currentPage) {
      setCurrentPage(currentPageProp);
    }
  }, [currentPage, currentPageProp, pagesQuantity]);

  // handlers
  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onPageChange(page);
    },
    [onPageChange]
  );

  const state = useMemo(() => {
    return {
      hoverIconLeft,
      hoverIconRight,
      currentPage,
      pagesQuantity,
      separatorIcon,
      normalStyles,
      activeStyles,
      isDisabled,
      innerLimit,
      separatorStyles,
      outerLimit,
    };
  }, [
    activeStyles,
    currentPage,
    hoverIconLeft,
    hoverIconRight,
    innerLimit,
    isDisabled,
    normalStyles,
    outerLimit,
    pagesQuantity,
    separatorIcon,
    separatorStyles,
  ]);

  const actions = useMemo(() => {
    return {
      setCurrentPage,
      setIsDisabled,
      changePage,
    };
  }, [changePage]);

  return (
    <PaginatorContext.Provider
      value={useMemo(() => {
        return {
          state,
          actions,
        };
      }, [actions, state])}
    >
      {children}
    </PaginatorContext.Provider>
  );
};
