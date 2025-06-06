import type { ReactNode } from "react";

import { RootStore } from "lib/stores/root";
import { createContext, useContext } from "react";

let store: RootStore;
export const StoreContext = createContext<RootStore | undefined>(undefined);

function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within StoreProvider");
  }

  return context;
}

function initializeStore(): RootStore {
  const root = store ?? new RootStore();

  // For server rendering always create a new store
  if (typeof window === "undefined") return root;

  // Create the store once in the client
  if (!store) store = root;

  return root;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initStore = initializeStore();

  return (
    <StoreContext.Provider value={initStore}>{children}</StoreContext.Provider>
  );
}

export function useAccountStore() {
  const { accountStore } = useStore();
  return accountStore;
}

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

export function useSchemaStore() {
  const { schemaStore } = useStore();
  return schemaStore;
}

export function useNetworkStore() {
  const { networkStore } = useStore();
  return networkStore;
}

export function useLocalChainConfigStore() {
  const { localChainConfigStore } = useStore();
  return localChainConfigStore;
}

export function useMoveVerifyTaskStore() {
  const { moveVerifyTaskStore } = useStore();
  return moveVerifyTaskStore;
}
