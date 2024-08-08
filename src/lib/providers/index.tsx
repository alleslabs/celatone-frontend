import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { ChainProvider } from "./cosmos-kit";
import { NetworkGuard } from "./network-guard";
import { QueryClientProvider } from "./query-client";
import { StoreProvider } from "./store";
import { TxBroadcastProvider } from "./tx-broadcast";

export default ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <QueryClientProvider>
      <AppProvider>
        <ChakraProvider>
          <NetworkGuard>
            <ChainProvider>
              <NavProvider>
                <AmplitudeProvider>
                  <TxBroadcastProvider>{children}</TxBroadcastProvider>
                </AmplitudeProvider>
              </NavProvider>
            </ChainProvider>
          </NetworkGuard>
        </ChakraProvider>
      </AppProvider>
    </QueryClientProvider>
  </StoreProvider>
);
