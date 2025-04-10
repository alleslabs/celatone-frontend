import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { CosmosKitProvider } from "./cosmos-kit";
import { InitiaTerms } from "./initia-terms";
import { InitiaWidgetProvider } from "./initia-widget";
import { NetworkGuard } from "./network-guard";
import { QueryClientProvider } from "./query-client";
import { StoreProvider } from "./store";
import { TxBroadcastProvider } from "./tx-broadcast";

export default ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <QueryClientProvider>
      <AppProvider>
        <InitiaTerms>
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
        </InitiaTerms>
      </AppProvider>
    </QueryClientProvider>
  </StoreProvider>
);
