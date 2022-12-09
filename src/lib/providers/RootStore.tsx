import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { RootStore } from "lib/stores/root";

let store: RootStore;
export const StoreContext = createContext<RootStore | undefined>(undefined);

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootProvider");
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
