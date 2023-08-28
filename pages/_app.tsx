import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";
import { FC, useEffect } from "react";
// @ts-ignore
import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";
import {
  persistor, wrapper
} from "../app/store";
import MomentDurationFormatProvider from "../context/MomentDurationFormatContext";
import ErrorFallback from "../features/error/ErrorFallback";
import lightTheme from "../styles/themes/lightTheme";
import "../styles/_global.scss";
import createEmotionCache from "../utils/createEmotionCache";
import SwiperJSConfig from "../features/common/SwiperJsConfig";
import useAppConfig from "../hooks/useAppConfig";
import Script from "next/script";
import { useRouter } from "next/router";
import { sendGtagPageView } from "../utils/system";


const clientSideEmotionCache = createEmotionCache();
const ChartJSConfig = dynamic(() => import("../features/common/ChartJsConfig"), { ssr: false });
// const SwiperJSConfig = dynamic(() => import("../features/common/SwiperJsConfig"), { ssr: false });

const { ua, ga, testMode } = useAppConfig();
const App: FC<AppProps & { emotionCache: EmotionCache }> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouterChange = (url: string) => {
      if (testMode) return;
      if (ua) sendGtagPageView(ua, url);
      if (ga) sendGtagPageView(ga, url);
    }
    router.events.on("routeChangeComplete", handleRouterChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouterChange);
    }
  }, [router.events]);

  return <CacheProvider value={emotionCache}>
    <ThemeProvider theme={lightTheme}>
      <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallback message={error.message} />}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={5000}>
          <SessionProvider session={pageProps.session}>
            {typeof window !== "undefined"
              ? <PersistGate loading={null} persistor={persistor}>
                <NextNProgress color="var(--menuTextColor)" height={2} options={{ showSpinner: false }} />
                <ChartJSConfig />
                <SwiperJSConfig />
                <MomentDurationFormatProvider>

                  {(!!ua || !!ga) && !testMode && <>
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <Script
                      strategy="afterInteractive"
                      src={`https://www.googletagmanager.com/gtag/js?id=${ua || ga}`}
                    />
                    <Script
                      id="google-analytics"
                      strategy="afterInteractive"
                      dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        ${!!ua ? `gtag('config', '${ua}', {
                          page_path: window.location.pathname
                        });` : ''}
                        ${!!ga ? `gtag('config', '${ga}', {
                          page_path: window.location.pathname
                        });` : ''}`
                      }}
                    />
                  </>}

                  <Component {...pageProps} />
                </MomentDurationFormatProvider>
              </PersistGate>
              : <Component {...pageProps} />}
          </SessionProvider>
        </SnackbarProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </CacheProvider>
};

export default wrapper.withRedux(App);