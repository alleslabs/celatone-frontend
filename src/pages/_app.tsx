/* eslint-disable react/jsx-props-no-spreading */
import { wallets } from "@cosmos-kit/keplr";
import { WalletProvider } from "@cosmos-kit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { assets, chains } from "chain-registry";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import localforage from "localforage";
import { configurePersistable } from "mobx-persist-store";
import { enableStaticRendering } from "mobx-react-lite";
import { DefaultSeo } from "next-seo";
import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import {
  CELATONE_CONSTANTS,
  CELATONE_APP_CONTRACT_ADDRESS,
  CELATONE_FALLBACK_GAS_PRICE,
} from "env";
import { AppProvider } from "lib/app-provider/contexts/app";
import { Chakra } from "lib/components/Chakra";
import { MobileGuard } from "lib/components/MobileGuard";
import { terra2testnet, terra2testnetAssets } from "lib/config/terra2testnet";
import Layout from "lib/layout";
import "lib/styles/globals.css";
import { StoreProvider } from "lib/providers/store";
import { TxBroadcastProvider } from "lib/providers/tx-broadcast";

dayjs.extend(relativeTime);
dayjs.extend(utc);
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
      <QueryClientProvider client={queryClient}>
        <WalletProvider
          chains={[...chains, terra2testnet]}
          assetLists={[...assets, terra2testnetAssets]}
          wallets={wallets}
          endpointOptions={{
            terra2: {
              rpc: ["https://terra-rpc.polkachu.com"],
            },
            terra2testnet: {
              rest: ["https://pisco-lcd.terra.dev"],
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
                <DefaultSeo {...defaultSEOConfig} />
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

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  if (appContext.ctx.res?.statusCode === 404) {
    appContext.ctx.res.writeHead(302, { Location: "/" });
    appContext.ctx.res.end();
    return undefined;
  }

  return { ...appProps };
};

export default MyApp;
