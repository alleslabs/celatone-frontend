import type { DocumentContext } from "next/document";

import { ColorModeScript } from "@chakra-ui/react";
import { FALLBACK_THEME } from "config/theme";
import Meta from "lib/components/Meta";
import { config } from "lib/styles/theme/config";
import { fontHrefs } from "lib/styles/theme/fonts";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href={fontHrefs.heading} rel="stylesheet" />
          <link href={fontHrefs.body} rel="stylesheet" />
          <link href={fontHrefs.mono} rel="stylesheet" />
          <link
            id="favicon"
            href={FALLBACK_THEME.branding.favicon}
            rel="shortcut icon"
          />
          <Meta />
        </Head>
        <body>
          <ColorModeScript initialColorMode={config.initialColorMode} />
          <Main />
          <NextScript />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            strategy="lazyOnload"
          />
          <Script id="google-tag-manager" strategy="lazyOnload">
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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
