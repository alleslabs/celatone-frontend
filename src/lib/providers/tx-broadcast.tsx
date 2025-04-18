import type { TxBroadcast } from "lib/hooks";
import type { Nullable, TxResultRendering } from "lib/types";
import type { ProviderProps, ReactNode } from "react";
import type { Observable } from "rxjs";

import { TxModal } from "lib/components/tx";
import { TxBroadcastContext } from "lib/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export const TxBroadcastProvider = ({ children }: { children: ReactNode }) => {
  const [stream, setStream] =
    useState<Nullable<Observable<TxResultRendering>>>(null);
  const [result, setResult] = useState<Nullable<TxResultRendering>>(null);

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
        error: () => {
          onModalClose();
        },
        next: setResult,
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
