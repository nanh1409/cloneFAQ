import { Box, Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { SxProps } from "@mui/system";
import classNames from "classnames";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { PropsWithoutRef, ReactNode, useCallback } from "react";
import { useSelector } from "../../app/hooks";
import ThirdPartyAds from "../../features/ads/third-party-ads";
import AppDownloadButton from "../../features/common/AppDownloadButton";
import DefaultAppDownloadButton from "../../features/common/AppDownloadButton/DefaultAppDownloadButton";
import useAppConfig from "../../hooks/useAppConfig";
import HeroSectionContainer from "./HeroSectionContainer";
import "./style.scss";

export type HeroSectionLayoutBg = "normal" | "grid-right" | "full-text-left";

const HeroSection = (props: PropsWithoutRef<{
  layoutBg?: HeroSectionLayoutBg;
  titleH1?: ReactNode;
  summary?: string;
  bgImage?: string;
  ctaElement?: JSX.Element;
  contentStyles?: SxProps;
  minHeight?: number;
  mobileMinHeight?: number;
  backgroundColor?: string;
  mobileBgImage?: string;
  getPro?: boolean;
  summaryGetPro?: ReactNode;

}>) => {
  const {
    layoutBg = "normal",
    titleH1 = '',
    bgImage = '',
    summary = '',
    ctaElement = <></>,
    contentStyles = {},
    minHeight = 750,
    mobileMinHeight = 400,
    backgroundColor = "transparent",
    mobileBgImage,
    getPro = false,
    summaryGetPro = <></>
  } = props;
  const { uiVersion, appName, appTitlePostfix, appSubtitle, useSlideHeroSection, useTrademark } = useAppConfig();
  const appInfo = useSelector((state) => state.appInfos.appInfo);

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));
  const isDownTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const router = useRouter();

  const renderHeroSection = useCallback(() => {
    const _bgImage = isMobileUI && !!mobileBgImage ? mobileBgImage : bgImage;
    if (uiVersion === 2) {
      return <>
        {_bgImage && <Image
          className="hero-section-image"
          src={_bgImage}
          alt="background-hero-section"
          layout="fill"
          objectFit="cover"
          objectPosition="center 0px"
          quality={100}
          priority
        />}
        <Container maxWidth="xl" className="hero-section-main-v2">
          <div className={classNames("app-info", appName)}>
            <img src={`/images/icon/${appName}/app-icon.png`} className="app-info-icon" />
            <div className="app-info-text">
              <div className="app-info-title">
                <span className="app-info-name">
                  {appName.toUpperCase()}
                  {useTrademark && <sup style={{fontSize: isDownTabletUI ? "24px" : "36px"}}>®</sup>}
                </span>
                <span className="app-info-name-postfix">{appTitlePostfix}</span>
              </div>
              <div className="app-info-subtitle" dangerouslySetInnerHTML={{__html: appSubtitle}}/>
            </div>
          </div>

          <div className="app-platform">
            <div className="download-app">
              <DefaultAppDownloadButton source="chplay" />
              <DefaultAppDownloadButton source="appstore" />
            </div>
            <div className="qr-app">
              <div className="qr-app-container">
                <QRCodeCanvas value={`${appInfo.siteAddress}/qrcode`} size={isMobileUI ? 124 : 180} />
              </div>
            </div>
          </div>
        </Container>
      </>
    }
    if (layoutBg === "normal") {
      return <>
        {_bgImage && <Image
          className="hero-section-image"
          src={_bgImage}
          alt="background-hero-section"
          layout="fill"
          objectFit="cover"
          objectPosition="center 0px"
          quality={80}
          priority
        />}
        <Container maxWidth="xl" className="hero-section-main">
          <Box className="hero-section-content" sx={{ ...contentStyles }}>
            <h1 className="title-h1">{titleH1}</h1>
            <div className="summary" dangerouslySetInnerHTML={{ __html: summary }}></div>
          </Box>
          {ctaElement}
        </Container>
      </>
    } else if (layoutBg === "grid-right") {
      return <>
        <Container maxWidth="xl" className="hero-section-main-bg-right">
          <Grid container className="hero-section-main-bg-right-grid">
            <Grid item xs={12} md={8} className="hero-section-main-bg-right-content">
              <Box className="hero-section-content" sx={{ ...contentStyles }}>
                <h1 className="title-h1" style={{ color: `var(--titleColor)` }}>{titleH1}</h1>
                <div className="summary" dangerouslySetInnerHTML={{ __html: summary }}></div>
              </Box>
              {ctaElement}
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "initial" } }} className="hero-section-bg-right">
              {_bgImage && <Image
                className="hero-section-image"
                src={_bgImage}
                alt="background-hero-section"
                layout="responsive"
                width="100%"
                height="100%"
                objectFit="scale-down"
                objectPosition="bottom"
                quality={80}
              />}
            </Grid>
          </Grid>
        </Container>
      </>
    } else if (layoutBg === "full-text-left") {
      return <>
        {_bgImage && <Image
          className="hero-section-image"
          src={_bgImage}
          alt="background-hero-section"
          layout="fill"
          objectFit="cover"
          objectPosition="right center"
          quality={80}
        />}
        <Container maxWidth="xl" className="hero-section-main">
          <Box className="hero-section-content" sx={{ ...contentStyles }}>
            <h1 className="title-h1" style={{ color: `var(--titleColor)` }}>{titleH1}</h1>
            <div className="summary" dangerouslySetInnerHTML={{ __html: summary }}></div>
          </Box>
          {ctaElement}
        </Container>
      </>
    }
    return <></>
  }, [layoutBg, titleH1, summary, bgImage, contentStyles, ctaElement, contentStyles, mobileBgImage, isMobileUI, isDownTabletUI]);

  const renderHeroSectionGetPro = useCallback(() => {
    const _bgImage = isMobileUI && !!mobileBgImage ? mobileBgImage : bgImage;
    return <>
      {_bgImage && <Image
        className="hero-section-image"
        src={_bgImage}
        alt="background-hero-section"
        layout="fill"
        objectFit="cover"
        objectPosition="center 0px"
        quality={100}
        priority
      />}
      <Container maxWidth="xxl" className="hero-section-main-getpro" sx={{ zIndex: 1 }}>
        <Box sx={{ ...contentStyles }}>
          {titleH1}
          {summaryGetPro}
        </Box>
        {ctaElement}
      </Container>
    </>
  }, [titleH1, summary, bgImage, contentStyles, ctaElement, contentStyles, mobileBgImage, isMobileUI, isDownTabletUI])

  return <HeroSectionContainer
    useSlide={useSlideHeroSection && !getPro}
    slideItems={appName === "toeic" && router.locale === "vi" && [
      <ThirdPartyAds
        name="onthisinhvien"
        type={isMobileUI ? "hero-section-mobile" : "hero-section"}
        utmContent="hero-section"
      />
    ]}
  >
    <div
      id="hero-section"
      style={{
        minHeight: isMobileUI ? `${mobileMinHeight}px` : `${minHeight}px`,
        backgroundColor
      }}
    >
      {getPro ? renderHeroSectionGetPro() : renderHeroSection()}
    </div >
  </HeroSectionContainer>

}

export default HeroSection