import { useLocalChainConfigStore } from "lib/providers/store";
import { useCelatoneApp } from "../contexts";
import { useInternalNavigate } from ".";

/**
 * This hook must be used under an observer
 * because it uses `isLocalChainIdExist` from `useLocalChainConfigStore`
 */
export const useIsLocalChainIdExist = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const navigate = useInternalNavigate();
  const { isLocalChainIdExist } = useLocalChainConfigStore();
  const { currentChainId } = useCelatoneApp();

  const isExist = isLocalChainIdExist(currentChainId);
  if (isExist && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isExist;
};
