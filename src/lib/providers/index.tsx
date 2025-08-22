import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { CosmosKitProvider } from "./cosmos-kit";
import { HoverProvider } from "./hover";
import { InitiaWidgetProvider } from "./initia-widget";
import { NetworkGuard } from "./network-guard";
import { QueryClientProvider } from "./query-client";
import { StoreProvider } from "./store";
import { TxBroadcastProvider } from "./tx-broadcast";
import { TxDecoderProvider } from "./tx-decoder";

export default ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <QueryClientProvider>
      <AppProvider>
        <ChakraProvider>
          <NetworkGuard>
            <CosmosKitProvider>
              <InitiaWidgetProvider>
                <TxDecoderProvider>
                  <HoverProvider>
                    <NavProvider>
                      <AmplitudeProvider>
                        <TxBroadcastProvider>{children}</TxBroadcastProvider>
                      </AmplitudeProvider>
                    </NavProvider>
                  </HoverProvider>
                </TxDecoderProvider>
              </InitiaWidgetProvider>
            </CosmosKitProvider>
          </NetworkGuard>
        </ChakraProvider>
      </AppProvider>
    </QueryClientProvider>
  </StoreProvider>
);
