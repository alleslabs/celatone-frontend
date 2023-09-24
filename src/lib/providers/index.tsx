import { AppProvider, NavProvider } from "lib/app-provider";

import { AmplitudeProvider } from "./amplitude";
import { ChakraProvider } from "./chakra";
import { ChainProvider } from "./cosmos-kit";
import { QueryClientProvider } from "./query-client";
import { StoreProvider } from "./store";
import { TxBroadcastProvider } from "./tx-broadcast";

export default ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <QueryClientProvider>
      <StoreProvider>
        <AppProvider>
          <ChainProvider>
            <NavProvider>
              <AmplitudeProvider>
                <TxBroadcastProvider>{children}</TxBroadcastProvider>
              </AmplitudeProvider>
            </NavProvider>
          </ChainProvider>
        </AppProvider>
      </StoreProvider>
    </QueryClientProvider>
  </ChakraProvider>
);
