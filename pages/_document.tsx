import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import useAppConfig from "../hooks/useAppConfig";
import createEmotionCache from "../utils/createEmotionCache";

const { facebookAppId, gtm, testMode } = useAppConfig();
class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {!!gtm && !testMode && <script id="google-tag-manager" dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtm}');`
          }} />}
          <script src="https://accounts.google.com/gsi/client" async defer />
          {!!facebookAppId && <meta property="fb:app_id" content={`${facebookAppId}`} />}
        </Head>

        <body>
          {!!gtm && !testMode && <>
            <noscript dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }} />
          </>}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

AppDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props) => <App {...props} emotionCache={cache} />
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags
    ]
  }
}

export default AppDocument;