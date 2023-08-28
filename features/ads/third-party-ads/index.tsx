import _ from "lodash";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { CSSProperties, PropsWithoutRef, useMemo, useState } from "react";
import useAppConfig from "../../../hooks/useAppConfig";
import { mapThirdPartyAdsTypeHeight, thirdPartyAds, ThirdPartyAdsNames, ThirdPartyAdsType } from "./thirdPartyAdsConfig";

export type ThirdPartyAdsProps = {
  name: ThirdPartyAdsNames;
  type: ThirdPartyAdsType;
  style?: CSSProperties;
  noResponsive?: boolean;
  className?: string;
  storageKey?: string;
  onClick?: () => void;
  enableCheckUpgradeCached?: boolean;
  utmContent?: string;
};

const parseAdsURL = (_url: string): Partial<URL> => {
  let url = _url;
  if (url.startsWith("/")) url = window.location.origin + url;
  try {
    return new URL(url)
  } catch (error) {
    return {};
  }
}

const ThirdPartyAds = (props: PropsWithoutRef<ThirdPartyAdsProps>) => {
  const { name, type, style, noResponsive, className, onClick, utmContent } = props;
  const { multiLocales } = useAppConfig();
  const router = useRouter();
  const hasGtag = typeof gtag !== "undefined";

  const adsData = thirdPartyAds[name];
  const isClient = typeof window !== "undefined";

  const countClickAds = () => {
    if (typeof onClick !== "undefined") onClick();
    console.log("click_ads");
    if (gtag) {
      gtag("event", "ad_click", {
        event_category: "third-party-ads",
        event_label: name
      });
    }
  }

  const adsUrl = useMemo(() => {
    if (!adsData || !adsData.url) return "";
    let query = "";
    if (isClient) {
      query = parseAdsURL(adsData?.url)?.search || "";
      if (query) {
        const params = parseAdsURL(adsData?.url)?.searchParams;
        if (utmContent && (!params.has('utm_content') || params.get('utm_content') !== utmContent)) adsData.url += `&utm_content=${utmContent || ""}`
      }
    }
    return isClient ? `${adsData?.url}${query ? "" : `?data-from=${window.location.href}`}` : adsData?.url
  }, [adsData?.url, isClient, utmContent]);

  const adsImg = useMemo(() => {
    if (!multiLocales || !_.isNil(adsData?.images)) return adsData?.images?.[type];
    return adsData?.localeImages?.[type]?.[router.locale];
  }, [adsData?.images, adsData?.localeImages, multiLocales, router.locale, type]);

  return adsData
    ? <div
      style={style}
      className={className}
      onClick={countClickAds}
    >
      <ins className="thirdpartyads">
        <a suppressHydrationWarning href={adsUrl} target={adsData?.target ?? "_blank"} rel="nofollow noopener">
          {/* <img
            src={adsImg}
            alt=""
            style={{
              maxWidth: noResponsive ? undefined : "100%",
              height: noResponsive ? undefined : "auto",
            }}
            height={mapThirdPartyAdsTypeHeight[type]}
          /> */}
          {adsImg && <Image
            src={adsImg}
            alt=""
            style={{
              maxWidth: noResponsive ? undefined : "100%",
              height: noResponsive ? undefined : "auto",
              width: "100%"
            }}
            height={mapThirdPartyAdsTypeHeight[type]}
            quality={type === "hero-section" ? 100 : undefined}
          />}
        </a>
      </ins>
    </div>
    : <></>
}

export default ThirdPartyAds;