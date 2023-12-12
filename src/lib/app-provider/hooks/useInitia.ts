import { useCelatoneApp } from "../contexts";

export const useInitia = () => {
  const {
    chainConfig: { chain },
  } = useCelatoneApp();
  return chain === "initia";
};
