import { useInitia } from "./useInitia";
import { useInternalNavigate } from "./useInternalNavigate";

export const useAllowCustomNetworks = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const navigate = useInternalNavigate();
  const isInitia = useInitia();

  if (!isInitia && shouldRedirect) navigate({ pathname: "/", replace: true });

  return isInitia;
};
