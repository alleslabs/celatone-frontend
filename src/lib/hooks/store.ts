import { useRootStore } from "lib/providers/RootStore";

export function useCodeStore() {
  const { codeStore } = useRootStore();
  return codeStore;
}

export function useContractStore() {
  const { contractStore } = useRootStore();
  return contractStore;
}
