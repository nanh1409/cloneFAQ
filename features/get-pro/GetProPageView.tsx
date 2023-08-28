import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Container } from "@mui/system";
import {
  PayPalButtons,
  PayPalScriptProvider
} from "@paypal/react-paypal-js";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import moment from "moment";
import dynamic from "next/dynamic";
import FutureImage from "next/future/image";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_GET_PRO, ROUTER_LOGIN, SUB_ROUTER_GET_PRO_CHECKOUT, SUB_ROUTER_GET_PRO_PAYMENT_DETAILS } from "../../app/router";
import CtaButton from "../../components/CtaButton";
import Footer from "../../components/footer";
import HeroSection from "../../components/hero-section";
import BoxReview from "../../components/review/BoxReview";
import useAppConfig from "../../hooks/useAppConfig";
import { GEN_CODE_TYPE_ALL, ORDER_SUCCESS, PAYMENT_BANK, PAYMENT_PAYPAL, PAYMENT_VNPAY } from "../../modules/share/constraint";
import { PricingPlan } from "../../modules/share/model/pricingPlan";
import { genCode } from "../../modules/share/utils";
import { getAffiliateSource, getArticleSource } from "../affiliate/useAffiliateLink";
import { getAccessToken } from "../auth/auth.slice";
import { apiGetGeoInfo } from "../common/common.api";
import AudienceItem from "./components/AudienceItem";
import IntroItem from "./components/IntroItem";
import PlanItem from "./components/PlanItem";
import "./getProPageView.scss";
import VNPayIcon from "./icons/VNPayIcon";
import { apiCapturePayPalPayment } from "./payment.api";
import { checkoutPayment } from "./payment.slice";
import { genOrderCheckSum } from "./payment.utils";
import useGetProConfig, { GetProConfig, MapLocalePlanFeatures, PlanFeatures, SelectedPlanData } from "./useGetProConfig";

const CountUpChoose = dynamic(() => import("./components/CountUpChoose"), { ssr: false })

const GetProPageView = (props: {
  isLandingPageOnly?: boolean;
  lang?: string;
  hideFooter?: boolean;
  hideFooterBanner?: boolean;
}) => {
  const {
    isLandingPageOnly,
    lang,
    hideFooter,
    hideFooterBanner
  } = props;
  const hasGtag = typeof gtag !== "undefined";
  const planRef = useRef<HTMLDivElement>(null);
  const token = getAccessToken();
  const appPlans = useSelector((state) => state.paymentState.appPlans);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const router = useRouter();
  const locale = lang || router.locale;
  const user = useSelector((state) => state.authState.user);
  const dispatch = useDispatch();

  const config = useGetProConfig();
  const { multiLocales, testMode, appName } = useAppConfig();
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [activeAudience, setActiveAudience] = useState(1);
  // const [activeTabletPlan, setActiceTabletPlan] = useState(config.primaryPlanIndex);
  const [showUgradeBannerBot, setShowUpgradeBannerBot] = useState(false);
  const pageReferer = router.query.from;
  let scrollCheckoutTimeout: any = null;

  const dataCountUps = useMemo(() => config.countUp, []);
  const _summaryGetPro = useMemo(() => config.contentHeroSection.summary[locale]?.replace(/\$nameGetpro/, `<b>${config.contentHeroSection.name}</b>`), [locale]);
  const _audienceGetpros = useMemo(() => config.audiences.filter(audience => audience.locale === locale), [locale]);
  const _featureIntrosLeft = useMemo(() => config.introFeatures.slice(0, 3), [])
  const _featureIntrosRight = useMemo(() => config.introFeatures.slice(3), [])
  const h2Title = useMemo(() => config.content[locale], [locale])
  const ctaBtnText = useMemo(() => {
    switch (locale) {
      case "vi":
        return "Luyện tập Ngay"
      case "fr":
        return "pratique maintenant";
      case "es":
        return "practica ahora"
      case "jp":
        return "今すぐ練習しよう";
      case "en":
      default:
        return "Practice Now"
    }
  }, [locale])

  useEffect(() => {
    apiGetGeoInfo()
      .then((data) => {
        if (data) {
          setShowBankTransfer(data.country === "VN" || testMode);
        }
      })
  }, []);

  // useEffect(() => {
  //   setTableHeaderHeight(tableHeaderRef.current?.clientHeight);
  // }, []);

  useEffect(() => {
    return () => {
      if (scrollCheckoutTimeout) clearTimeout(scrollCheckoutTimeout);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (pageReferer === "checkout") {
        scrollCheckoutTimeout = setTimeout(() => {
          const activationPanelEl = document.getElementById("get-pro-activation-panel");
          if (activationPanelEl) {
            activationPanelEl.scrollIntoView({ behavior: "smooth" });
            const inputEl = activationPanelEl.querySelector("input");
            if (inputEl) inputEl.focus();
          }
        }, 1000);
      }
    }
  }, [pageReferer]);

  useEffect(() => {
    const handleShowUgradeBannerBot = () => {
      if (window.scrollY > 750) {
        if (hideFooterBanner) return;
        setShowUpgradeBannerBot(true);
      } else {
        setShowUpgradeBannerBot(false);
      }
    }
    window.addEventListener("scroll", handleShowUgradeBannerBot);
    return () => {
      window.removeEventListener("scroll", handleShowUgradeBannerBot);
    }
  }, [])

  const features = useMemo(() =>
    multiLocales ? (config.features as MapLocalePlanFeatures)[locale] : (config.features as PlanFeatures)
    , [locale]);

  const mapSubsKeyPlan = useMemo(() => {
    return appPlans.reduce((map, e) => {
      const key = `${e.subscriptionTimeValue}-${e.subscriptionTimeUnit}`;
      // if (e.currencyCode === "USD") {
      map[key] = [...(map[key] || []), e];
      // }
      return map;
    }, {} as { [subsKey: string]: PricingPlan[] })
  }, [appPlans]);

  const totalPlans = useMemo(() => Object.keys(config.plan).length, []);

  const planData = useMemo(() => (
    Object.entries(config.plan).filter(([accessLevel, { features }]) => !(!features[locale] && isLandingPageOnly))
  ), [config, locale, isLandingPageOnly]);

  const trans = useMemo(() => {
    let dividerOr = "OR";
    let btnBankTransferTitle = "Bank Transfer";
    let btnActiveTitle = "Active";
    let btnUpgradeCtaTitle = "Get Pro Now";
    let labelTotalPrice = "Price";
    if (locale === "vi") {
      dividerOr = "HOẶC";
      btnBankTransferTitle = "Chuyển khoản ngân hàng";
      btnActiveTitle = "Kích hoạt";
      btnUpgradeCtaTitle = "Nâng Cấp Ngay";
      labelTotalPrice = "Giá"
    } else if (locale === "fr") {
      labelTotalPrice = "Prix"
    } else if (locale === "es") {
      labelTotalPrice = "Precio de"
    }
    return {
      dividerOr,
      btnBankTransferTitle,
      btnActiveTitle,
      btnUpgradeCtaTitle,
      labelTotalPrice
    }
  }, [locale]);

  const appContentTrans = useMemo(() => {
    let quoteFirstLine = "";
    let quoteSecondLine = "";
    let upgradeBotContent = <span>Upgrade Your Account</span>;
    let salesPercent = 0;
    if (appName === "toeic") {
      salesPercent = 70;
      quoteFirstLine = `"TOEIC exam is not difficult if you put enough effort into your test preparation. Bear in mind that "Success is no accident.`;
      quoteSecondLine = `It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do." Let’s achieve your expected TOEIC score with our TOEIC Test Pro"`;
      if (locale === "vi") {
        quoteFirstLine = `"Thi TOEIC không khó, nhưng cần sự nỗ lực của chính bạn.`;
        quoteSecondLine = `Cùng đạt điểm cao TOEIC ngay bây giờ với các bài luyện tập của TOEIC Test Pro"`
      } else if (locale === "fr") {
        quoteFirstLine = `"Le TOEIC n'est pas difficile, mais il nécessite votre propre effort. `;
        quoteSecondLine = `Atteignez un score élevé au TOEIC dès maintenant avec les exercices de Toeic Test Pro."`
      } else if (locale === "jp") {
        quoteFirstLine = `『TOEICの試験は難しくはありませんが、自己の努力が必要です。`;
        quoteSecondLine = `TOEIC Test Proの練習問題で今すぐ高得点を目指しましょう！』`;
      } else if (locale === "es") {
        quoteFirstLine = "El examen TOEIC no es difícil, pero requiere tu propio esfuerzo";
        quoteSecondLine = "¡Alcanza altas puntuaciones en el TOEIC ahora mismo con las prácticas de TOEIC Test Pro!";
      }
    }
    if (salesPercent) {
      upgradeBotContent = <>
        <span>Upgrade Your Account&nbsp;-&nbsp;</span>
        <span className="percent">Get <span className="percent-value">&nbsp;{salesPercent}%</span>&nbsp;Off</span>
      </>;
      if (locale === "vi") {
        upgradeBotContent = <>
          <span>Ưu Đãi&nbsp;</span>
          <span className="percent">&nbsp;GIẢM <span className="percent-value">{salesPercent}%</span></span>
          <span>&nbsp;Khi Nâng Cấp Tài Khoản</span>
        </>;
      }
    }
    return {
      quoteFirstLine,
      quoteSecondLine,
      upgradeBotContent
    }
  }, [appName, locale]);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobileUI = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptop = useMediaQuery(theme.breakpoints.down("xxl"));
  const isDownXl = useMediaQuery(theme.breakpoints.down("xl"));
  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const upSm = useMediaQuery(theme.breakpoints.up("sm"))

  const [selectedPlanData, setSelectedPlanData] = useState<SelectedPlanData | null>(null);
  // const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  // const tableHeaderRef = useRef<HTMLTableSectionElement>(null);

  const handleOpenPaymentDialog = (args: { subsType: string; planName: string; price: { [locale: string]: ReactNode } }) => {
    if (isLandingPageOnly) {
      const returnUrl = `/${ROUTER_GET_PRO}/?lang=${locale}&nav=true#pricing-plans`;
      window.location.assign(`${appInfo.siteAddress}/${ROUTER_LOGIN}/?utm_id=${appName}-i18n&utm_campaign=${appName}-i18n&utm_medium=article&utm_source=landing-${locale}&utm_content=plan&redirect_uri=${encodeURIComponent(returnUrl)}`)
      return;
    }
    if (!user) {
      const { pathname, search, hash } = window.location;
      router.push({
        pathname: `/${ROUTER_LOGIN}`,
        query: {
          redirect_uri: `${pathname}${search}${hash}`
        }
      })
    } else {
      setSelectedPlanData(args);
    }
  }

  const handleClosePaymentDialog = () => {
    setSelectedPlanData(null);
  }

  const handleCreateOrder = async (subsKey: string, paymentMethod: number = PAYMENT_PAYPAL) => {
    const currencyCode = [PAYMENT_BANK, PAYMENT_VNPAY].includes(paymentMethod) ? "VND" : "USD";
    const plan = appPlans.find((plan) => subsKey === `${plan.subscriptionTimeValue}-${plan.subscriptionTimeUnit}` && plan.currencyCode === currencyCode);
    if (plan) {
      if (paymentMethod === PAYMENT_BANK) {
        router.push({
          pathname: `/${ROUTER_GET_PRO}/${SUB_ROUTER_GET_PRO_CHECKOUT}`,
          query: {
            planId: plan._id
          }
        });
        return;
      }
      let checkSum = "";
      let returnUrl = "";
      const affiliateCode = getAffiliateSource();
      const articleSource = getArticleSource();
      const orderPayload = {
        planId: plan._id,
        paymentMethod,
        serial: `${moment().format("YYYYMMDD")}-${genCode(8, GEN_CODE_TYPE_ALL)}`,
        content: `${articleSource ? `[${articleSource}] ` : ""}${selectedPlanData.planName} Plan`,
        email: user?.email,
        affiliateCode
      }
      if (paymentMethod === PAYMENT_VNPAY) {
        checkSum = genOrderCheckSum(orderPayload);
        returnUrl = `${window.location.origin}/${ROUTER_GET_PRO}/${SUB_ROUTER_GET_PRO_PAYMENT_DETAILS}`
      }
      const order = await dispatch(checkoutPayment({
        token,
        ...orderPayload,
        checkSum,
        returnUrl
      })).then(unwrapResult);
      if (paymentMethod === PAYMENT_PAYPAL) {
        return (order as { id: string }).id;
      } else if (paymentMethod === PAYMENT_VNPAY) {
        window.open(order as string);
      }
    }
    handleClosePaymentDialog();
    return "";
  }

  const handleCompletePayPalOrder = async (paymentId: string, status = ORDER_SUCCESS) => {
    const data = await apiCapturePayPalPayment({ paymentId, status });
    if (data) {
      if (data.returnStatus === "success" && hasGtag) {
        const label = pageReferer === "banner" ? "banner-ads" : "default";
        gtag("event", "purchase", {
          currency: "USD",
          transaction_id: `${data.serial}`,
          value: data.amount,
          event_label: label,
          coupon: label
        })
      }
    }
    handleClosePaymentDialog();
    router.push({
      pathname: `/${ROUTER_GET_PRO}/${SUB_ROUTER_GET_PRO_PAYMENT_DETAILS}`,
      query: {
        status: data?.returnStatus === "success" ? "success" : "capture_failed",
        orderTime: data.orderTime,
        content: "Upgrade Plan",
        amount: data.amount,
        paymentType: PAYMENT_PAYPAL,
        serial: data.serial
      }
    });
  }

  const onCancelPayPalOrder = (data: any) => {
    // data.orderId
  }

  const handleGoToGetProSection = (from?: "cta" | "cta_bot") => {
    if (hasGtag && from) {
      gtag("event", "click", {
        event_category: "click_button_upgrade",
        event_label: from
      })
    }
    router.push({
      hash: "pricing-plans"
    }, undefined, { shallow: true })
  }

  // tablet vs mobile
  const renderViewFeatureTabletMobile = () => {
    return (
      <Grid container spacing={3.75} className="intro-box">
        {
          config.introFeatures.map((feature, key) => (
            <Grid item xs={12}>
              <IntroItem
                title={feature.title[locale]}
                des={feature.des[locale]}
                img={feature.image}
                style={{
                  ...feature.style[locale]?.[isMobileUI ? "mobile" : "tablet"] || {},
                }}
                widthContent={isMobileUI ? 100 : 70}
                key={key}
                styleImg={feature.styleImg[locale]?.[!isMobileUI ? "tablet" : isDownSm ? "mobile" : "md"] || {}}
                colorText={feature.colorText}
                colorDes={feature.colorDes}
                alt={feature.alt}
                lang={locale}
              />
            </Grid>
          ))
        }
      </Grid>
    )
  }

  const renderViewFeaturePc = () => (
    <Grid container columnSpacing={3.75} className="intro-box">
      <Grid item xs={7} className="content">
        {
          _featureIntrosLeft.map((feature, key) => (
            <IntroItem
              title={feature.title[locale]}
              des={feature.des[locale]}
              img={feature.image}
              style={feature.style[locale]?.["pc"] || {}}
              widthContent={68}
              key={key}
              styleImg={feature.styleImg[locale]?.[isDownXl ? "lg" : "pc"] || {}}
              alt={feature.alt}
              lang={locale}
            />
          ))
        }
      </Grid>
      <Grid item xs={5} className="content">
        {
          _featureIntrosRight.map((feature, key) => (
            <IntroItem
              title={feature.title[locale]}
              des={feature.des[locale]}
              img={feature.image}
              style={{
                ...feature.style[locale]?.["pc"] || {},
                textAlign: 'left',
                paddingLeft: 25
              }}
              widthContent={100}
              colorText={feature.colorText}
              colorDes={feature.colorDes}
              key={key}
              styleImg={feature.styleImg[locale]?.[isDownXl ? "lg" : "pc"] || {}}
              alt={feature.alt}
              lang={locale}
            />
          ))
        }
      </Grid>
    </Grid>
  )

  const SwiperSlidePlan = (planData: Array<[string, GetProConfig["plan"][number]]>) => {
    return (
      planData.map(([accessLevel, { name, totalPrice, subTitle, features: _features }], i) => {
        const featureApp = multiLocales ? (_features as MapLocalePlanFeatures)[locale] : _features as PlanFeatures;
        return <Fragment key={i}>
          {/* {!featureApp[locale] && isLandingPageOnly
            ? <></>
            :  */}
          <SwiperSlide className={classNames(
            "tablet-plan-box-item"
          )}
          >
            <PlanItem
              icon={<FutureImage height={50} src={accessLevel === "0" ? "/images/get-pro/icon-plan-free.svg" : "/images/get-pro/icon-plan-premium.svg"} alt="plan icon" loading="lazy" />}
              title={config.plan[+accessLevel]?.localeNames?.[locale] ?? config.plan[+accessLevel]?.name}
              subTitle={subTitle[locale]}
              services={featureApp?.reduce((service, feature, index) => (feature && service.push(features[index]), service), [])}
              button={
                accessLevel === "0"
                  ? <button className="button-plan-free"
                    onClick={() => {
                      if (!user) {
                        const { pathname, search, hash } = window.location;
                        router.push({
                          pathname: `/${ROUTER_LOGIN}`,
                          query: {
                            redirect_uri: `${pathname}${search}${hash}`
                          }
                        })
                      } else {
                        router.push({
                          pathname: '/'
                        })
                      }
                    }}
                  >{h2Title?.contentFree}</button>
                  : Object.entries(totalPrice).map(([subsKey, dataPrice], i) => {
                    const appPlan = mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan;
                    let subsTimeUnit = `${appPlan.subscriptionTimeUnit}${appPlan.subscriptionTimeValue !== 1 ? "s" : ""}`;
                    let textSlash = "/";
                    let showSubTimeValue = true;
                    let dollarSign = "$";
                    let showColon = true;
                    if (locale === "vi") {
                      if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "năm";
                      else if (appPlan.subscriptionTimeUnit === "month") subsTimeUnit = "tháng";
                    } else if (locale === "fr") {
                      textSlash = "per ";
                      showSubTimeValue = false;
                      if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "an";
                    } else if (locale === "jp") {
                      if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "年の";
                      showSubTimeValue = false;
                      dollarSign = "ドル";
                    } else if (locale == "es") {
                      if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "año";
                      showColon = false;
                      textSlash = "por ";
                      showSubTimeValue = false;
                    }
                    const subsTime =
                      `${showSubTimeValue ? `${appPlan.subscriptionTimeValue} ` : ""}${subsTimeUnit}`
                    return <button key={i} className="button-plan-premium" onClick={() => handleOpenPaymentDialog({
                      subsType: subsKey,
                      planName: name,
                      price: {
                        "en": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                        "vi": <>{(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "VND") ?? {} as PricingPlan).price}&#8363;</>,
                        "fr": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                        "jp": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                        "es": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>
                      }
                    })}>
                      {locale !== "jp" && <span>{trans.labelTotalPrice}{showColon ? ":" : ""} </span>}
                      {!!dataPrice.price && <><span className="data-total-price">{dataPrice.price.replace("$", dollarSign)}</span>&nbsp;&nbsp;</>}
                      <span className="data-plan-price">{appPlan.price}{dollarSign}&nbsp;</span>
                      <span className="data-plan-subs-time">{textSlash}{subsTime}</span>
                      {locale === "jp" && <span>価格</span>}
                    </button>
                  })
              }
              isRecommend={accessLevel !== "0"}
              className={classNames(
                isMobileUI && "plan-box-mobile",
                !+accessLevel ? "free-tablet" : "box-shadow",
                isTabletUI && "plan-box-tablet"
              )}
              lang={locale}
            />
          </SwiperSlide>
          {/* } */}
        </Fragment>
      })
    )
  }

  return <PayPalScriptProvider options={{
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    intent: "capture",
    currency: "USD"
  }}>
    {/* <Container maxWidth="xl" id="get-pro-view"> */}

    {/* {isTabletUI ? renderViewTablet() : renderViewDesktop()} */}

    {/* <div className="getpro-info">
        <div className={classNames("getpro-info-text", isTabletUI ? "tablet" : "")}>
          <h2 className="getpro-info-text-title">{getProTitle}</h2>
          <div className="getpro-info-text-content">{getProContent}</div>
        </div>

        {getProImages.map((image, i) => <div className={classNames(
          "getpro-info-image",
          isTabletUI ? "tablet" : "",
          isMobileUI ? "mobile" : "",
          ((!isTabletUI && i % 4 === 1)
            || (isTabletUI && i % 2 === 1)
            || isMobileUI
          ) ? "last" : ""
        )} key={i}>
          <img src={image.src} alt={image.alt} />
          <div className="getpro-info-image-alt">{image.alt}</div>
        </div>)}
      </div> */}

    {/* <div className="getpro-feedback"> */}
    {/* <h2 className="getpro-feedback-title">FEEDBACK</h2> */}
    {/* </div> */}
    <HeroSection
      getPro
      bgImage={`/images/get-pro/${appName}/bg-hero-section-getpro.png`}
      mobileBgImage={`/images/get-pro/${appName}/bg-hero-section-getpro-mob.png`}
      titleH1={<h1 className={classNames("title-getpro", locale, isMobileUI ? "title-getpro-mobile" : "")} style={isTabletUI ? { marginTop: 20 } : {}}>
        <p className="slogan-getpro" style={{ width: isLaptop || locale === "fr" ? "auto" : "max-content" }} dangerouslySetInnerHTML={{__html: config.contentHeroSection.title[locale]}} />
        <div className="name-getpro">
          <p dangerouslySetInnerHTML={{__html: config.contentHeroSection.name}}/>
          <img src="/images/get-pro/icon-getpro-crown.png" alt="icon get pro" loading="lazy" />
        </div>
      </h1>}
      summaryGetPro={
        <p dangerouslySetInnerHTML={{ __html: _summaryGetPro }} className="summary-getpro" style={isMobileUI ? { fontSize: 16 } : {}} />
      }
      ctaElement={<div style={{
        display: "flex",
        justifyContent: 'center',
        marginBottom: 18
      }}>
        <CtaButton
          // onClick={() => { planRef?.current?.scrollIntoView() }}
          onClick={() => handleGoToGetProSection("cta")}
          title={ctaBtnText}
          color={`var(--btnUpgrade)`}
          background={`var(--btnUpgradeBackground)`}
          backgroundLayerColor={`var(--btnUpgradeBackgroundLayer)`}
          titleClassName={classNames("cta-getpro-title", isMobileUI ? "cta-getpro-title-mobile" : "")}
          buttonClassName={classNames("cta-getpro-button", isMobileUI ? "cta-getpro-button-mobile" : "")}
          borderRadius={27}
          width={450}
        />
      </div>}
      // mobileMinHeight={}
      minHeight={750}
    />
    <Container maxWidth="xl" id="getpro-container-view">
      {/*  */}
      <div className="audience">
        <h2 className="title-content">{h2Title?.h2Audience}</h2>
        <Grid container spacing={isMobileUI ? 3 : 1} className="audience-list">
          {
            _audienceGetpros.map((_audienceGetpro, index) => (
              <Grid item xs={12} sm={6} xl={3} key={_audienceGetpro.title} style={{ height: useMediaQuery('(max-width: 780px)') && upSm && ["fr", "es"].includes(locale) ? 450 : 347 }}>
                <AudienceItem
                  icon={<FutureImage src={_audienceGetpro.icon} width={25} loading="lazy" alt={_audienceGetpro.alt || ""} />}
                  title={_audienceGetpro.title}
                  description={_audienceGetpro.des}
                  isHighlight={index === activeAudience}
                  onMouseOver={() => { setActiveAudience(index) }}
                  onMouseLeave={() => { setActiveAudience(1) }}
                  lang={locale}
                />
              </Grid>
            ))
          }
        </Grid>
      </div>

      {/*  */}
      <div className="intro-feature" style={
        ["fr", "es"].includes(locale) && !isDownXl ? {
          padding: 65
        } : {}
      }>
        <div dangerouslySetInnerHTML={{ __html: h2Title?.h2IntroFeature }} />
        <Grid container className={classNames("boost-skill", isMobileUI && "boost-skill-mobile")}>
          <Grid item xs={12} md={7} className="content">
            <div className="title">{config.boostSkillContent.title[locale]}</div>
            <p>{config.boostSkillContent.des[locale]}</p>
          </Grid>
          <Grid item xs={12} md={5} className="image">
            <FutureImage src={config.boostSkillContent.image} style={isTabletUI ? { right: 10 } : {}} width={296} />
          </Grid>
        </Grid>

        {!isTabletUI ? renderViewFeaturePc() : renderViewFeatureTabletMobile()}
      </div>

      {/*  */}
      <div className="choose-us" style={isMobileUI ? {
        height: 750,
        background: "#fff",
      } : {}}>
        <h2 className="title-content" style={{ paddingTop: 38, marginBottom: isTabletUI && !isMobileUI ? "10px" : "" }}>{h2Title?.h2ChooseUs}</h2>
        <Grid container className="box-count-up">
          {
            dataCountUps.map(data => (
              <Grid item sm={12} md={4} key={data.title[locale]} style={isMobileUI ? { marginTop: 20 } : {}}>
                <CountUpChoose
                  prefix={data.prefix?.[locale]}
                  title={data.title[locale]}
                  start={0}
                  end={data.number}
                  duration={2.3}
                  enableScrollSpy
                  colorNumber={data.color}
                  className={isTabletUI ? "countup-box-tablet" : ""}
                />
              </Grid>
            ))
          }
        </Grid>
      </div>
    </Container>

    <div style={{ position: "relative" }}>
      <Container maxWidth="xxl" sx={{
        "&::after": {
          position: "absolute",
          content: '""',
          height: 400,
          width: "100%",
          bottom: 0,
          left: 0,
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.81) 56.25%, #FFFFFF 84.9%)"
        }
      }}>
        {/* review */}
        <div id="user-feedback">
          <div dangerouslySetInnerHTML={{ __html: h2Title?.h2Review }} />
          <p className="sub-title" style={{ width: isTabletUI && "auto" }}>{h2Title?.subTitleReview}</p>
          <BoxReview height={800} />
        </div>
      </Container>
    </div>

    <Container maxWidth="xl" sx={{ overflow: "hidden" }}>
      {/* plan */}
      <div className="plan-wrap" ref={planRef}>
        <h2 className="title-content" style={{ marginBottom: 0 }}>{h2Title?.h2Plan}</h2>
        <p className="sub-title" style={{ width: isTabletUI ? "auto" : '60%', marginBottom: 52 }}>{h2Title?.subTitlePlan}</p>

        {isTabletUI
          ? <div style={{ paddingBottom: "20px" }} id="pricing-plans">
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              slidesPerGroup={1}
              navigation={{
                nextEl: ".nav-right",
                prevEl: ".nav-left"
              }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              className="tablet-plan-box"
              initialSlide={config.primaryPlanIndex}
            >
              {SwiperSlidePlan(planData)}
              {planData.length > 1 && <>
                <IconButton className="tablet-get-pro-plan-nav nav-left">
                  <ChevronLeft fontSize="large" />
                </IconButton>

                <IconButton className="tablet-get-pro-plan-nav nav-right">
                  <ChevronRight fontSize="large" />
                </IconButton>
              </>}
            </Swiper>
          </div>
          : <Grid container spacing={2} id="pricing-plans" sx={{ paddingBottom: "20px", justifyContent: "center" }}>
            {
              Object.entries(config.plan).map(([accessLevel, { name, totalPrice, subTitle, features: _features }], i) => {
                const featureApp = multiLocales ? (_features as MapLocalePlanFeatures)[locale] : _features as PlanFeatures;
                return <Fragment key={i}>
                  {/* {!(!featureApp[locale] && isLandingPageOnly)
                    &&  */}
                  <Grid item xs={12} lg={12 / totalPlans} position="relative">
                    <PlanItem
                      icon={<FutureImage height={50} src={accessLevel === "0" ? "/images/get-pro/icon-plan-free.svg" : "/images/get-pro/icon-plan-premium.svg"} alt="plan icon" loading="lazy" />}
                      title={config.plan[+accessLevel]?.localeNames?.[locale] ?? config.plan[+accessLevel]?.name}
                      subTitle={subTitle[locale]}
                      services={featureApp?.reduce((service, feature, index) => (feature && service.push(features[index]), service), [])}
                      button={
                        accessLevel === "0"
                          ? <button className="button-plan-free"
                            onClick={() => {
                              if (isLandingPageOnly) {
                                window.location.assign(`${appInfo.siteAddress}/?utm_id=${appName}-i18n&utm_campaign=${appName}-i18n&utm_medium=article&utm_source=landing-${locale}&utm_content=plan`)
                                return
                              }
                              if (!user) {
                                const { pathname, search, hash } = window.location;
                                router.push({
                                  pathname: `/${ROUTER_LOGIN}`,
                                  query: {
                                    redirect_uri: `${pathname}${search}${hash}`
                                  }
                                })
                              } else {
                                router.push({
                                  pathname: '/'
                                })
                              }
                            }}
                          >{h2Title?.contentFree}</button>
                          : Object.entries(totalPrice).map(([subsKey, dataPrice], i) => {
                            const appPlan = mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan;
                            let subsTimeUnit = `${appPlan.subscriptionTimeUnit}${appPlan.subscriptionTimeValue !== 1 ? "s" : ""}`;
                            let textSlash = "/";
                            let showSubTimeValue = true;
                            let dollarSign = "$";
                            let showColon = true;
                            if (locale === "vi") {
                              if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "năm";
                              else if (appPlan.subscriptionTimeUnit === "month") subsTimeUnit = "tháng";
                            } else if (locale === "fr") {
                              textSlash = "per ";
                              showSubTimeValue = false;
                              if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "an";
                            } else if (locale === "jp") {
                              if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "年の";
                              showSubTimeValue = false;
                              dollarSign = "ドル";
                            } else if (locale === "es") {
                              if (appPlan.subscriptionTimeUnit === "year") subsTimeUnit = "año";
                              showColon = false;
                              textSlash = "por ";
                              showSubTimeValue = false;
                            }
                            const subsTime =
                              `${showSubTimeValue ? `${appPlan.subscriptionTimeValue} ` : ""}${subsTimeUnit}`
                            return <button key={i} className="button-plan-premium" onClick={() => handleOpenPaymentDialog({
                              subsType: subsKey,
                              planName: name,
                              price: {
                                "en": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                                "vi": <>{(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "VND") ?? {} as PricingPlan).price}&#8363;</>,
                                "fr": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                                "jp": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
                                "es": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>
                              }
                            })}>
                              {locale !== "jp" && <span>{trans.labelTotalPrice}{showColon ? ":" : ""} </span>}
                              {!!dataPrice.price && <><span className="data-total-price">{dataPrice.price.replace("$", dollarSign)}</span>&nbsp;&nbsp;</>}
                              <span className="data-plan-price">{appPlan.price}{dollarSign}&nbsp;</span>
                              <span className="data-plan-subs-time">{textSlash}{subsTime}</span>
                              {locale === "jp" && <span>価格</span>}
                            </button>
                          })
                      }
                      isRecommend={accessLevel !== "0"}
                      className={classNames(
                        !+accessLevel ? "free" : "box-shadow",
                      )}
                      lang={locale}
                    />
                  </Grid>
                  {/* } */}
                </Fragment>
              })
            }
          </Grid>}
      </div>
    </Container>

    <Container maxWidth="xl">
      {/* quote */}
      <div id="get-pro-quote">
        <FutureImage src="/images/get-pro/icon-quote.svg" className="quote-icon" width="148" height="148" style={isTabletUI ? { top: "-43px", left: "-34px" } : {}} loading="lazy" alt="quote icon" />
        <div className="quote-content">
          <p className="firts-line">{appContentTrans.quoteFirstLine}</p>
          <p className="seconds-line">{appContentTrans.quoteSecondLine}</p>
        </div>
      </div>
    </Container>

    <div id="upgrade-pro-bot-banner" className={classNames(
      showUgradeBannerBot && "show",
      isTabletUI && "tablet"
    )}>
      <Container maxWidth="xl">
        <Grid container spacing={1}>
          <Grid item xs={12} md={2}>
            {!!appInfo?.appLogo && <div className={classNames(
              "pro-logo-bot",
              isTabletUI && !isMobileUI && "tablet",
              isMobileUI && "mobile"
            )}>
              <Image
                layout="fill"
                objectFit="contain"
                objectPosition="left"
                src={appInfo?.appLogo}
                alt="logo"
              />
            </div>}
          </Grid>


          <Grid item xs={12} md={10}>
            <Grid container spacing={1}>
              <Grid item xs={12} lg={9}>
                <div className={classNames(
                  "upgrade-cta-text",
                  isTabletUI && "tablet"
                )}>
                  {appContentTrans.upgradeBotContent}
                </div>
              </Grid>

              <Grid item xs={12} lg={3}>
                <div className={classNames(
                  "upgrade-cta-button",
                  isTabletUI && !isMobileUI && "tablet",
                  isMobileUI && "mobile"
                )}>
                  <Button className="upgrade-cta-button-main" onClick={() => handleGoToGetProSection("cta_bot")}>
                    {trans.btnUpgradeCtaTitle}
                  </Button>
                </div>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Container>
    </div>

    {!hideFooter && <div className={classNames("get-pro-footer-wrap", isTabletUI && "tablet")}>
      <Footer />
    </div>}

    <Dialog
      open={!!selectedPlanData}
      onClose={handleClosePaymentDialog}
      fullWidth
      maxWidth="sm"
      PaperProps={{ id: "payment-dialog" }}
    >
      {!!selectedPlanData && <>
        <DialogTitle className="payment-dialog-title">{selectedPlanData.planName.toUpperCase()} PLAN</DialogTitle>
        <DialogContent className="payment-dialog-content">
          <div className="get-pro-info">Upgrade for {selectedPlanData.price[locale]}</div>
          <PayPalButtons
            createOrder={() => handleCreateOrder(selectedPlanData.subsType)}
            onApprove={(data, actions) => handleCompletePayPalOrder(data.orderID)}
            onCancel={onCancelPayPalOrder}
            style={{ shape: "pill" }}
          />
          {config.vnpay && <>
            <Divider style={{ marginBottom: "20px" }}>{trans.dividerOr}</Divider>
            <Button className="vnpay-button" variant="outlined" size="large" onClick={() => handleCreateOrder(selectedPlanData.subsType, PAYMENT_VNPAY)}>
              <VNPayIcon />
            </Button>
          </>}
          {
            showBankTransfer && (
              <>
                <Divider style={{ marginBottom: "20px" }}>{trans.dividerOr}</Divider>
                <Button className="vnpay-button" variant="outlined" size="large" onClick={() => {
                  router.push(`/payment-methods`, undefined, { locale: "vi" })
                }}>
                  {trans.btnBankTransferTitle}
                </Button>
              </>
            )
          }
        </DialogContent>
      </>}
    </Dialog>
    {/* </Container> */}
  </PayPalScriptProvider>
}

export default GetProPageView;