import type { ProviderProps, ReactNode } from "react";
import {
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useState,
  createContext,
} from "react";
import type { Observable } from "rxjs";

import { TxModal } from "lib/components/tx";
import type { TxResultRendering } from "lib/types";

interface TxBroadcast {
  broadcast: (nextStream: Observable<TxResultRendering>) => void;
}
const TxBroadcastContext = createContext<TxBroadcast>({
  broadcast: () => null,
});

export const TxBroadcastProvider = ({ children }: { children: ReactNode }) => {
  const [stream, setStream] = useState<Observable<TxResultRendering> | null>(
    null
  );
  const [result, setResult] = useState<TxResultRendering | null>(null);

  const broadcast = useCallback((nextStream: Observable<TxResultRendering>) => {
    setStream(nextStream);
  }, []);

  const contextValue: ProviderProps<TxBroadcast>["value"] = useMemo(
    () => ({ broadcast }),
    [broadcast]
  );

  const onModalClose = () => {
    setStream(null);
    setResult(null);
  };

  useEffect(() => {
    if (stream) {
      const subscription = stream.subscribe({
        next: setResult,
        error: () => {
          onModalClose();
        },
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
  }, [stream]);

  return (
    <TxBroadcastContext.Provider value={contextValue}>
      {children}
      {result && <TxModal result={result} onClose={onModalClose} />}
    </TxBroadcastContext.Provider>
  );
};

export const useTxBroadcast = () => useContext(TxBroadcastContext);
