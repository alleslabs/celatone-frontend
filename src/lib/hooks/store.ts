import { useStore } from "lib/providers/store";

export function useCodeStore() {
  const { codeStore } = useStore();
  return codeStore;
}

export function useContractStore() {
  const { contractStore } = useStore();
  return contractStore;
}

export function usePublicProjectStore() {
  const { publicProjectStore } = useStore();
  return publicProjectStore;
}
