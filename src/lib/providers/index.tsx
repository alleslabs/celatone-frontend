import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { ChainProvider } from "./cosmos-kit";
import { NetworkGuard } from "./NetworkGuard";
import { QueryClientProvider } from "./query-client";
import { StoreProvider } from "./store";
import { TxBroadcastProvider } from "./tx-broadcast";

export default ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <AppProvider>
      <ChakraProvider>
        <NetworkGuard>
          <QueryClientProvider>
            <ChainProvider>
              <NavProvider>
                <AmplitudeProvider>
                  <TxBroadcastProvider>{children}</TxBroadcastProvider>
                </AmplitudeProvider>
              </NavProvider>
            </ChainProvider>
          </QueryClientProvider>
        </NetworkGuard>
      </ChakraProvider>
    </AppProvider>
  </StoreProvider>
);
