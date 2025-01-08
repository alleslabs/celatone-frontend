import type { ButtonProps } from "@chakra-ui/react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type React from "react";
import type { Dispatch, FC, SetStateAction } from "react";

import type { IconKeys } from "../icon";

import { INITIAL_VALUES } from "./paginationData";

export type PaginatorContextValues = {
  actions: {
    changePage: (page: number) => void;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setIsDisabled: Dispatch<SetStateAction<boolean>>;
  };
  state: {
    activeStyles: ButtonProps;
    currentPage: number;
    hoverIconLeft?: IconKeys;
    hoverIconRight?: IconKeys;
    innerLimit: number;
    isDisabled: boolean;
    normalStyles: ButtonProps;
    outerLimit: number;
    pagesQuantity?: number;
    separatorIcon?: IconKeys;
    separatorStyles: ButtonProps;
  };
};

export const PaginatorContext = createContext<PaginatorContextValues>({
  actions: {
    changePage: () => null,
    setCurrentPage: () => null,
    setIsDisabled: () => null,
  },
  state: {
    activeStyles: INITIAL_VALUES.activeStyles,
    currentPage: INITIAL_VALUES.currentPage,
    hoverIconLeft: INITIAL_VALUES.hoverIconLeft,
    hoverIconRight: INITIAL_VALUES.hoverIconRight,
    innerLimit: INITIAL_VALUES.innerLimit,
    isDisabled: INITIAL_VALUES.isDisabled,
    normalStyles: INITIAL_VALUES.normalStyles,
    outerLimit: INITIAL_VALUES.outerLimit,
    pagesQuantity: INITIAL_VALUES.pagesQuantity,
    separatorIcon: INITIAL_VALUES.separatorIcon,
    separatorStyles: INITIAL_VALUES.separatorStyles,
  },
});

type PaginatorProviderProps = {
  activeStyles: ButtonProps;

  children?: React.ReactNode;
  currentPage: number;
  hoverIconLeft?: IconKeys;
  hoverIconRight?: IconKeys;
  innerLimit: number;
  isDisabled: boolean;
  normalStyles: ButtonProps;
  onPageChange: (page: number) => void;
  outerLimit: number;
  pagesQuantity?: number;
  separatorIcon?: IconKeys;
  separatorStyles: ButtonProps;
};

export const PaginatorProvider: FC<PaginatorProviderProps> = ({
  activeStyles: activeStylesProp,
  children,
  currentPage: currentPageProp,
  hoverIconLeft: hoverIconLeftProp,
  hoverIconRight: hoverIconRightProp,
  innerLimit: innerLimitProp,
  isDisabled: isDisabledProp,
  normalStyles: normalStylesProp,
  onPageChange,
  outerLimit: outerLimitProp,
  pagesQuantity: pagesQuantityProp,
  separatorIcon: separatorIconProp,
  separatorStyles: separatorStylesProp,
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
    if (!Number.isInteger(currentPageProp)) {
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
      changePage,
      setCurrentPage,
      setIsDisabled,
    };
  }, [changePage]);

  return (
    <PaginatorContext.Provider
      value={useMemo(() => {
        return {
          actions,
          state,
        };
      }, [actions, state])}
    >
      {children}
    </PaginatorContext.Provider>
  );
};
