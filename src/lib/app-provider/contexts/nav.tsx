import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useContext, createContext, useMemo } from "react";

import { usePreviousPathname } from "../hooks/usePreviousPathname";
import { StorageKeys } from "lib/data";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import type { Nullable } from "lib/types";

interface NavContextInterface {
  isExpand: boolean;
  prevPathname: Nullable<string>;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}
const NavContext = createContext<NavContextInterface>({
  isExpand: false,
  prevPathname: null,
  setIsExpand: () => {},
});

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [isExpand, setIsExpand] = useLocalStorage(StorageKeys.NavSidebar, true);
  const prevPathname = usePreviousPathname();

  const states = useMemo<NavContextInterface>(
    () => ({
      isExpand,
      prevPathname,
      setIsExpand,
    }),
    [isExpand, prevPathname, setIsExpand]
  );

  return <NavContext.Provider value={states}>{children}</NavContext.Provider>;
};

export const useNavContext = (): NavContextInterface => {
  return useContext(NavContext);
};
