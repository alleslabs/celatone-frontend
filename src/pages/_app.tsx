import { wallets } from "@cosmos-kit/keplr";
import { WalletProvider } from "@cosmos-kit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { assets, chains } from "chain-registry";
import localforage from "localforage";
import { configurePersistable } from "mobx-persist-store";
import { enableStaticRendering } from "mobx-react-lite";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

import {
  CELATONE_CONSTANTS,
  CELATONE_APP_CONTRACT_ADDRESS,
  CELATONE_FALLBACK_GAS_PRICE,
} from "env";
import { AppProvider } from "lib/app-provider/contexts/app";
import { Chakra } from "lib/components/Chakra";
import { MobileGuard } from "lib/components/MobileGuard";
import { CelatoneSeo } from "lib/components/Seo";
import { terra2testnet, terra2testnetAssets } from "lib/config/terra2testnet";
import Layout from "lib/layout";
import "lib/styles/globals.css";
import { StoreProvider } from "lib/providers/store";
import { TxBroadcastProvider } from "lib/providers/tx-broadcast";

enableStaticRendering(typeof window === "undefined");

localforage.config({
  name: "celatone_web_app",
  storeName: "key_value_pairs",
  version: 1.0,
  description: "Celatone",
});

const isBrowser = typeof window !== "undefined";

configurePersistable({
  storage: isBrowser ? localforage : undefined,
  stringify: false,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();

  return (
    <Chakra>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script strategy="lazyOnload" id="google-tag-manager">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
            debug_mode: true
          });
        `}
      </Script>

      <QueryClientProvider client={queryClient}>
        <WalletProvider
          chains={[...chains, terra2testnet]}
          assetLists={[...assets, terra2testnetAssets]}
          wallets={wallets}
          endpointOptions={{
            osmosis: {
              rpc: ["https://rpc.osmosis.zone/"],
              rest: ["https://lcd.osmosis.zone/"],
            },
            osmosistestnet: {
              rpc: ["https://rpc-test.osmosis.zone/"],
              rest: ["https://lcd-test.osmosis.zone/"],
            },
            terra2: {
              rpc: ["https://terra-rpc.lavenderfive.com/"],
              rest: ["https://phoenix-lcd.terra.dev/"],
            },
            terra2testnet: {
              rpc: ["https://terra-testnet-rpc.polkachu.com/"],
              rest: ["https://pisco-lcd.terra.dev/"],
            },
          }}
        >
          <StoreProvider>
            <AppProvider
              fallbackGasPrice={CELATONE_FALLBACK_GAS_PRICE}
              appContractAddressMap={CELATONE_APP_CONTRACT_ADDRESS}
              constants={CELATONE_CONSTANTS}
            >
              <TxBroadcastProvider>
                <Head>
                  <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                  />
                </Head>
                <CelatoneSeo />
                <Layout>
                  <MobileGuard>
                    <Component {...pageProps} />
                  </MobileGuard>
                </Layout>
              </TxBroadcastProvider>
            </AppProvider>
          </StoreProvider>
        </WalletProvider>
      </QueryClientProvider>
    </Chakra>
  );
};

export default MyApp;
