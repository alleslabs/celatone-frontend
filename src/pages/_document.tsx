import { ColorModeScript } from "@chakra-ui/react";
import type { DocumentContext } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

import { CURR_THEME } from "env";
import Meta from "lib/components/Meta";
import customTheme from "lib/styles/theme";

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href={CURR_THEME.fonts.body.url} rel="stylesheet" />
          <link href={CURR_THEME.fonts.heading.url} rel="stylesheet" />
          <link rel="shortcut icon" href={CURR_THEME.branding.favicon} />
          <Meta />
        </Head>
        <body>
          <ColorModeScript
            initialColorMode={customTheme.config?.initialColorMode}
          />
          <Main />
          <NextScript />
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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
