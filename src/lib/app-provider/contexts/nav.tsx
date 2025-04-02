import type { Dispatch, ReactNode, SetStateAction } from "react";

import { StorageKeys } from "lib/data";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import { createContext, useContext, useMemo } from "react";

interface NavContextInterface {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
  submenus: Record<string, [boolean, Dispatch<SetStateAction<boolean>>]>;
}
const NavContext = createContext<NavContextInterface>({
  isExpand: false,
  setIsExpand: () => {},
  submenus: {},
});

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [isExpand, setIsExpand] = useLocalStorage(StorageKeys.NavSidebar, true);
  const [isDevExpand, setIsDevExpand] = useLocalStorage(
    StorageKeys.DevSidebar,
    true
  );
  const [isProjectExpand, setIsProjectExpand] = useLocalStorage(
    StorageKeys.ProjectSidebar,
    true
  );

  const states = useMemo<NavContextInterface>(
    () => ({
      isExpand,
      setIsExpand,
      submenus: {
        [StorageKeys.DevSidebar]: [isDevExpand, setIsDevExpand],
        [StorageKeys.ProjectSidebar]: [isProjectExpand, setIsProjectExpand],
      },
    }),
    [
      isExpand,
      setIsExpand,
      isDevExpand,
      setIsDevExpand,
      isProjectExpand,
      setIsProjectExpand,
    ]
  );

  return <NavContext.Provider value={states}>{children}</NavContext.Provider>;
};

export const useNavContext = (): NavContextInterface => {
  return useContext(NavContext);
};
