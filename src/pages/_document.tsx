/* eslint-disable react/jsx-props-no-spreading */
import { ColorModeScript } from "@chakra-ui/react";
import type { DocumentContext } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";

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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
