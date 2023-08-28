import { Adsense } from "@ctrl/react-adsense";
import { CSSProperties, PropsWithoutRef } from "react";
import { useSelector } from "../../../app/hooks";
import useAppConfig from "../../../hooks/useAppConfig";
import useUserPaymentInfo from "../../get-pro/useUserPaymentInfo";
import { AppAdsSlot, CommonAdsSlot, getGoogleAdsClient, GoogleAdsName, googleAdsNames, GoogleCommonAdsName, googleCommonAdsNames, _GoogleAdsName } from "./googleAdsConfig";

export type GoogleAdsenseProps = {
  name: GoogleAdsName;
  style?: CSSProperties,
  noResponsive?: boolean,
  height?: number;
  className?: string;
  enableCheckUpgrade?: boolean;
};

const GoogleAdsense = (props: PropsWithoutRef<GoogleAdsenseProps>) => {
  const { name, style, noResponsive, height: _height, className, enableCheckUpgrade } = props;
  const adsClient = getGoogleAdsClient();
  const { appName, testMode } = useAppConfig();
  const { paymentLoading, planAccessLevel } = useUserPaymentInfo();
  const app = useSelector((state) => state.appInfos.appInfo);
  const hasGtag = typeof gtag !== "undefined";

  const commonAds = googleCommonAdsNames.includes(name as any) ? ((CommonAdsSlot ?? {})[adsClient] ?? {})[name as GoogleCommonAdsName] : null;
  const appAds = googleAdsNames.includes(name as any) ? (((AppAdsSlot ?? {})[appName] ?? {})[name as _GoogleAdsName] ?? null) : null;

  const height = typeof _height !== "undefined"
    ? _height
    : (appAds?.shape === "horizontal"
      ? 90
      : (appAds?.shape === "square"
        ? 250
        : (appAds?.shape === "vertical" ? 728 : 0)
      )
    );

  const countClickAds = () => {
    console.log("click_ads");
    if (hasGtag) {
      gtag("event", "ad_click", {
        event_category: "display-ads",
        event_label: name
      })
    }
  }

  return (!!commonAds || appAds) && (enableCheckUpgrade && app?.usingGetPro ? (!paymentLoading && planAccessLevel === 0) : true)
    ? <div
      style={{
        ...style,
        ...((process.env.NODE_ENV !== "production" || testMode) ? { border: "1px solid #ccc", minHeight: height, position: "relative" } : {})
      }}
      className={className}
      onClick={countClickAds}>
      {(process.env.NODE_ENV !== "production" || testMode) && <span style={{ position: "absolute", background: "#007aff", color: "#fff", padding: "0 2px" }}>Ads</span>}
      <Adsense
        client={adsClient}
        slot={commonAds || appAds.data}
        style={{
          display: "block",
          width: "100%",
          height,
        }}
        format=""
        responsive={noResponsive ? undefined : "true"}
      />
    </div>
    : <></>
}

export default GoogleAdsense;