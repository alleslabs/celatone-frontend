import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useContext, createContext, useMemo } from "react";

import { usePreviousPathname } from "../hooks/usePreviousPathname";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import type { Option } from "lib/types";

interface NavContextInterface {
  isExpand: boolean;
  isDevMode: Option<boolean>;
  prevPathname: string | null;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
}
const NavContext = createContext<NavContextInterface>({
  isExpand: false,
  isDevMode: undefined,
  prevPathname: null,
  setIsExpand: () => {},
  setIsDevMode: () => {},
});

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [isDevMode, setIsDevMode] = useLocalStorage<Option<boolean>>(
    "devMode",
    undefined
  );
  const [isExpand, setIsExpand] = useLocalStorage("navbar", false);
  const prevPathname = usePreviousPathname();

  const states = useMemo<NavContextInterface>(
    () => ({
      isDevMode,
      isExpand,
      prevPathname,
      setIsDevMode,
      setIsExpand,
    }),
    [isDevMode, isExpand, prevPathname, setIsDevMode, setIsExpand]
  );

  return <NavContext.Provider value={states}>{children}</NavContext.Provider>;
};

export const useNavContext = (): NavContextInterface => {
  return useContext(NavContext);
};
