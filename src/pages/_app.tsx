/* eslint-disable react/jsx-props-no-spreading */
import type { Chain } from "@chain-registry/types";
import { GasPrice } from "@cosmjs/stargate";
import type { SignerOptions } from "@cosmos-kit/core";
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
import { CELATONE_CONSTANTS, FALLBACK_GAS_PRICE } from "env";
import { AppProvider } from "lib/app-provider/contexts/app";
import { TxBroadcastProvider } from "lib/app-provider/tx/tx-broadcast";
import { Chakra } from "lib/components/Chakra";
import { NoMobile } from "lib/components/modal";
import { useWidth } from "lib/hooks";
import Layout from "lib/layout";
import "lib/styles/globals.css";
import { StoreProvider } from "lib/providers/RootStore";

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
  const width = useWidth();
  const signerOptions: SignerOptions = {
    cosmwasm: (chain: Chain) => {
      if (
        chain.chain_name === "osmosis" ||
        chain.chain_name === "osmosistestnet"
      )
        return {
          gasPrice: GasPrice.fromString("0.0025uosmo"),
        };

      return undefined;
    },
  };

  return (
    <Chakra>
      {width < 510 ? (
        <NoMobile />
      ) : (
        <QueryClientProvider client={queryClient}>
          <WalletProvider
            chains={chains}
            assetLists={assets}
            wallets={wallets}
            signerOptions={signerOptions}
          >
            <StoreProvider>
              <AppProvider
                fallbackGasPrice={FALLBACK_GAS_PRICE}
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
                    <Component {...pageProps} />
                  </Layout>
                </TxBroadcastProvider>
              </AppProvider>
            </StoreProvider>
          </WalletProvider>
        </QueryClientProvider>
      )}
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
