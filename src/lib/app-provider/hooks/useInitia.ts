import { useInternalNavigate } from "./useInternalNavigate";
import { useCelatoneApp } from "../contexts";

export const useInitia = () => {
  const {
    chainConfig: { chain },
  } = useCelatoneApp();
  return chain === "initia";
};

export const useInitiaL1 = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const navigate = useInternalNavigate();
  const {
    chainConfig: {
      extra: { layer },
    },
  } = useCelatoneApp();

  if (layer !== "1" && shouldRedirect)
    navigate({ pathname: "/", replace: true });

  return layer === "1";
};
