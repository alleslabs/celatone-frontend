import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { CosmosKitProvider } from "./cosmos-kit";
import { InitiaWidgetProvider } from "./initia-widget";
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
            <CosmosKitProvider>
              <InitiaWidgetProvider>
                <NavProvider>
                  <AmplitudeProvider>
                    <TxBroadcastProvider>{children}</TxBroadcastProvider>
                  </AmplitudeProvider>
                </NavProvider>
              </InitiaWidgetProvider>
            </CosmosKitProvider>
          </NetworkGuard>
        </ChakraProvider>
      </AppProvider>
    </QueryClientProvider>
  </StoreProvider>
);
