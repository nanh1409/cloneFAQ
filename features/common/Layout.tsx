import { Global } from "@emotion/react";
import { MathJaxContext } from "better-react-mathjax";
import dynamic from "next/dynamic";
import { PropsWithChildren, useCallback, useRef } from "react";
import SEO, { SEOProps } from "../../components/SEO";
import { SiteScriptsProps } from "../../components/SiteScripts";
import useAppConfig from "../../hooks/useAppConfig";
import useAppStyles from "../../hooks/useAppStyles";
import useAppStylesGetPro from "../../hooks/useAppStylesGetPro";
import useGoogleSignIn from "../../hooks/useGoogleSignIn";
import useAffiliateLink from "../affiliate/useAffiliateLink";
import Header from "./Header";
import "./layout.scss";
import ParsedSEO from "./ParsedSEO";

const ButtonScrollTop = dynamic(() => import("./ButtonScrollTop"), { ssr: false });
const SiteScripts = dynamic(() => import("../../components/SiteScripts"), { ssr: false });

export type LayoutProps = SEOProps & SiteScriptsProps & {
  dmca?: string;
  googleSiteVerification?: string;
  backgroundColor?: string;
  disableAuth?: boolean;
  disableDefaultHeader?: boolean;
  disableDefaultHeaderNav?: boolean;
  noAlternateLink?: boolean;
  addMathJax?: boolean;
  seoHeaderString?: string;
  useGoogleSignInButton?: boolean;
  addFBComment?: boolean;
  enableSearch?: boolean;
  getPro?: boolean;
  homeHref?: string;
  googleAdsClient?: string;
  disableAds?: boolean;
};

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const {
    children,
    title,
    description = "",
    keywords = "",
    robots,
    slug,
    siteAddress,
    imageSharing: _imageSharing = "",
    imageSharingAlt = "",
    jsonLd = [],
    dmca,
    googleAdsClient,
    googleSiteVerification,
    backgroundColor,
    disableAuth,
    disableDefaultHeader,
    disableDefaultHeaderNav,
    noAlternateLink,
    disableFBMessenger,
    disableAds,
    addMathJax,
    seoHeaderString,
    useGoogleSignInButton,
    addFBComment,
    enableSearch,
    getPro = false,
    homeHref
  } = props;

  const { appName } = useAppConfig();
  const styleRules = useAppStyles();
  const styleRulesGetPro = useAppStylesGetPro();
  const headerRef = useRef<HTMLDivElement | null>(null);

  if (!disableAuth && !useGoogleSignInButton) {
    useGoogleSignIn({ parentContainerId: "google_onetap_picker" });
  }
  useAffiliateLink();

  const renderGGAdsScript = useCallback(() => {
    return !disableAds && googleAdsClient && <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsClient}`}
      crossOrigin="anonymous"
    />
  }, [googleAdsClient, disableAds])

  return (
    <>
      {!seoHeaderString
        ? <SEO
          title={title}
          description={description}
          keywords={keywords}
          robots={robots}
          slug={slug}
          siteAddress={siteAddress}
          jsonLd={jsonLd}
          appName={appName}
          imageSharing={_imageSharing}
          imageSharingAlt={imageSharingAlt}
          children={<>
            <meta name="dmca-site-verification" content={dmca} />
            <meta name="google-site-verification" content={googleSiteVerification} />
            {renderGGAdsScript()}
          </>}
          noAlternateLink={noAlternateLink}
        />
        : <ParsedSEO
          headerString={seoHeaderString}
          siteAddress={siteAddress}
          appName={appName}
          children={<>
            {renderGGAdsScript()}
          </>}
        />
      }
      <SiteScripts
        disableFBMessenger={disableFBMessenger}
        addFBComment={addFBComment}
      />
      <div id="google_onetap_picker" />
      {!disableDefaultHeader && (
        <Header ref={headerRef} disableAuth={disableAuth} enableSearch={enableSearch} disableNav={disableDefaultHeaderNav} homeHref={homeHref}/>
      )}
      <div id="main" style={{ marginTop: -1 }}>
        {addMathJax ? (
          <MathJaxContext
            version={3}
            config={{
              loader: { load: ["[tex]/html"] },
              tex: {
                packages: { "[+]": ["html"] },
                inlineMath: [
                  ["$", "$"],
                  ["\\(", "\\)"],
                ],
                displayMath: [
                  ["$", "$"],
                  ["\\(", "\\)"],
                ],
              },
              svg: {
                fontCache: "global",
              },
              options: {
                enableMenu: false,
              },
            }}
          >
            {children}
          </MathJaxContext>
        ) : (
            <>{children}</>
          )}
      </div>
      <ButtonScrollTop />
      <Global
        styles={`
          body {
            background-color: ${backgroundColor || "transparent"} !important;
          }
          .plain-anchor-tag {
            text-decoration: none;
            color: initial;
          }
          ${getPro ? styleRulesGetPro : styleRules}
        `}
      />
    </>
  );
};

export default Layout;
