import { createContext, useContext } from "react";
import type { Observable } from "rxjs";

import type { TxResultRendering } from "lib/types";

export interface TxBroadcast {
  broadcast: (nextStream: Observable<TxResultRendering>) => void;
}

export const TxBroadcastContext = createContext<TxBroadcast>({
  broadcast: () => null,
});

export const useTxBroadcast = () => useContext(TxBroadcastContext);
