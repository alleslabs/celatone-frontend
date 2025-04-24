import type { TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { createContext, useContext } from "react";

export interface TxBroadcast {
  broadcast: (nextStream: Observable<TxResultRendering>) => void;
}

export const TxBroadcastContext = createContext<TxBroadcast>({
  broadcast: () => null,
});

export const useTxBroadcast = () => useContext(TxBroadcastContext);
