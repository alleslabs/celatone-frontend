import type { EndpointOptions } from "@cosmos-kit/core";
import { wallets } from "@cosmos-kit/keplr";
import { ChainProvider } from "@cosmos-kit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { assets, chains } from "chain-registry";
import localforage from "localforage";
import { configurePersistable } from "mobx-persist-store";
import { enableStaticRendering } from "mobx-react-lite";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

import { CHAIN_CONFIGS } from "config";
import { AppProvider } from "lib/app-provider/contexts/app";
import {
  localosmosis,
  localosmosisAsset,
} from "lib/chain-registry/localosmosis";
import { sei, seiAssets } from "lib/chain-registry/sei";
import { Chakra } from "lib/components/Chakra";
import { MobileGuard } from "lib/components/MobileGuard";
import { CelatoneSeo } from "lib/components/Seo";
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

const availableChainsEndpoints = Object.values(CHAIN_CONFIGS).reduce<
  EndpointOptions["endpoints"]
>(
  (endpoints, config) => ({
    ...endpoints,
    [config.registryChainName]: {
      rpc: [config.rpc],
      rest: [config.lcd],
    },
  }),
  {}
);

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
        <ChainProvider
          chains={[...chains, localosmosis, sei]}
          assetLists={[...assets, localosmosisAsset, seiAssets]}
          wallets={wallets}
          endpointOptions={{
            isLazy: true,
            endpoints: availableChainsEndpoints,
          }}
          signerOptions={{
            preferredSignType: () => "direct",
          }}
          wrappedWithChakra
        >
          <StoreProvider>
            <AppProvider>
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
        </ChainProvider>
      </QueryClientProvider>
    </Chakra>
  );
};

export default MyApp;
