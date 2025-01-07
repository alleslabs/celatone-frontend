import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localforage from "localforage";
import { configurePersistable } from "mobx-persist-store";
import { enableStaticRendering } from "mobx-react-lite";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@interchain-ui/react/styles";

import { MobileGuard } from "lib/components/MobileGuard";
import { CelatoneSeo } from "lib/components/Seo";
import Layout from "lib/layout";
import "lib/styles/globals.css";
import Providers from "lib/providers";

enableStaticRendering(typeof window === "undefined");

localforage.config({
  description: "Celatone",
  name: "celatone_web_app",
  storeName: "key_value_pairs",
  version: 1.0,
});

const isBrowser = typeof window !== "undefined";

configurePersistable({
  storage: isBrowser ? localforage : undefined,
  stringify: false,
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Providers>
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
        <SpeedInsights />
        <Analytics />
      </MobileGuard>
    </Layout>
  </Providers>
);

export default MyApp;
