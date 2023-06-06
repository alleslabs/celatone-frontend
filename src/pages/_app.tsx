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
  CELATONE_APP_HUMAN_ADDRESS,
} from "env";
import { AppProvider } from "lib/app-provider/contexts/app";
import { Chakra } from "lib/components/Chakra";
import { MobileGuard } from "lib/components/MobileGuard";
import { CelatoneSeo } from "lib/components/Seo";
import { sei, seiAssets } from "lib/config/sei";
import { seitestnet2, seitestnet2Assets } from "lib/config/seitestnet2";
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
          chains={[...chains, terra2testnet, sei, seitestnet2]}
          assetLists={[
            ...assets,
            terra2testnetAssets,
            seiAssets,
            seitestnet2Assets,
          ]}
          wallets={wallets}
          endpointOptions={{
            osmosis: {
              rpc: ["https://rpc.osmosis.zone/"],
              rest: ["https://lcd.osmosis.zone/"],
            },
            osmosistestnet5: {
              rpc: ["https://rpc.osmotest5.osmosis.zone/"],
              rest: ["https://lcd.osmotest5.osmosis.zone/"],
            },
            terra2: {
              rpc: ["https://terra-rpc.lavenderfive.com/"],
              rest: ["https://phoenix-lcd.terra.dev/"],
            },
            terra2testnet: {
              rpc: ["https://terra-testnet-rpc.polkachu.com/"],
              rest: ["https://pisco-lcd.terra.dev/"],
            },
            sei: {
              rpc: ["https://sei-rpc.polkachu.com/"],
              rest: ["https://sei-api.polkachu.com/"],
            },
            seitestnet2: {
              rpc: ["https://rpc.atlantic-2.seinetwork.io/"],
              rest: ["https://rest.atlantic-2.seinetwork.io/"],
            },
          }}
        >
          <StoreProvider>
            <AppProvider
              fallbackGasPrice={CELATONE_FALLBACK_GAS_PRICE}
              appContractAddressMap={CELATONE_APP_CONTRACT_ADDRESS}
              appHumanAddressMap={CELATONE_APP_HUMAN_ADDRESS}
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
