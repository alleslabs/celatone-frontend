import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useContext, createContext, useMemo } from "react";

import { useLocalStorage } from "lib/hooks/useLocalStorage";
import type { Option } from "lib/types";

interface NavContextInterface {
  isExpand: boolean;
  isDevMode: Option<boolean>;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
}
const NavContext = createContext<NavContextInterface>({
  isExpand: false,
  isDevMode: undefined,
  setIsExpand: () => {},
  setIsDevMode: () => {},
});

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [isDevMode, setIsDevMode] = useLocalStorage<Option<boolean>>(
    "devMode",
    undefined
  );
  const [isExpand, setIsExpand] = useLocalStorage("navbar", false);

  const states = useMemo<NavContextInterface>(
    () => ({
      isDevMode,
      isExpand,
      setIsDevMode,
      setIsExpand,
    }),
    [isDevMode, isExpand, setIsDevMode, setIsExpand]
  );

  return <NavContext.Provider value={states}>{children}</NavContext.Provider>;
};

export const useNavContext = (): NavContextInterface => {
  return useContext(NavContext);
};
