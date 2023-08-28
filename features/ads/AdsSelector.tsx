import moment from "moment";
import { cloneElement, PropsWithoutRef, ReactElement, useEffect, useState } from "react";
import { useSelector } from "../../app/hooks";
import { StorageUtils } from "../../utils/system";
import useUserPaymentInfo from "../get-pro/useUserPaymentInfo";
import { GoogleAdsenseProps } from "./google-adsense";
import { ThirdPartyAdsProps } from "./third-party-ads";
import { AdsScenarioData, thirdPartyAds as _thirdPartyAds } from "./third-party-ads/thirdPartyAdsConfig";

const getInitScenarioData = (timeNow: number = Date.now()): AdsScenarioData => ({
  displayTime: 1, isDisplaying: true, displayDates: [timeNow]
});

const disableThirdPartyAdsEnv = process.env.NEXT_PUBLIC_DISABLE_THIRD_PARTY_ADS;
const disableThirdPartyAds = typeof disableThirdPartyAdsEnv !== "undefined" && ["true", "false"].includes(disableThirdPartyAdsEnv) ? !!JSON.parse(disableThirdPartyAdsEnv) : false;

const withScenarioClick = (component: ReactElement<ThirdPartyAdsProps>, scenarioUserId?: string) => {
  return cloneElement(component, {
    ...component.props,
    onClick: () => {
      if (typeof component.props.onClick !== "undefined") component.props.onClick();
      const { storageKey, name, type } = component.props;
      const scenarioDataKey = `${scenarioUserId ?? ""}_ads_scenario_data_${name}_${type}_${storageKey}`;
      const scenarioData = StorageUtils.getLocalObject<AdsScenarioData>(scenarioDataKey);
      StorageUtils.setLocalObject<AdsScenarioData>(scenarioDataKey, {
        ...(scenarioData || getInitScenarioData()),
        displayDates: [],
        isDisplaying: false,
        lastClick: Date.now()
      });
    }
  })
}

const AdsSelector = (props: PropsWithoutRef<{
  googleAds?: ReactElement<GoogleAdsenseProps>;
  thirdPartyAds?: ReactElement<ThirdPartyAdsProps>;
}>) => {
  const { googleAds, thirdPartyAds } = props;
  const [selectedAds, setSelectedAds] = useState<"googleAds" | "thirdPartyAds" | null>(null);
  const { geoInfo, geoInfoLoading } = useSelector((state) => state.layoutState);
  const userId = useSelector((state) => state.authState.userId);
  const { isProAcc } = useUserPaymentInfo();

  useEffect(() => {
    if (!googleAds && !thirdPartyAds) return;
    if (!thirdPartyAds || disableThirdPartyAds) {
      setSelectedAds("googleAds");
      return;
    }
    const {
      name,
      type,
      storageKey,
      enableCheckUpgradeCached
    } = thirdPartyAds.props;
    if (enableCheckUpgradeCached && isProAcc) {
      setSelectedAds("googleAds");
      return;
    }
    const thirdPartyAdsData = _thirdPartyAds[name];
    if (thirdPartyAdsData) {
      const { allowedLocale = [], scenario, scenarioByUser } = thirdPartyAdsData;
      if (allowedLocale.length) {
        if (geoInfoLoading) return;
        if (!allowedLocale.includes(geoInfo.country)) {
          setSelectedAds(!!googleAds ? "googleAds" : null);
          return;
        };
      }
      if (scenario) {
        let showThirdPartyAds = false;
        let scenarioDataKey = `_ads_scenario_data_${name}_${type}_${storageKey}`;
        if (scenarioByUser) scenarioDataKey = `${userId}${scenarioDataKey}`; 
        let scenarioData = StorageUtils.getLocalObject<AdsScenarioData>(scenarioDataKey);
        const timeNow = Date.now();
        const initScenarioData = getInitScenarioData(timeNow);
        if (!scenarioData) {
          scenarioData = initScenarioData;
          StorageUtils.setLocalObject<AdsScenarioData>(scenarioDataKey, initScenarioData);
        }
        const { isDisplaying, displayTime, lastClick, displayDates = [timeNow] } = scenarioData;
        const { maxIdleDays, hidePeriod, maxShowTimes } = scenario;
        let currentDisplayTime = displayTime;
        if (isDisplaying) {
          const newDisplayDates = [...displayDates];
          const [lastDisplay = timeNow] = displayDates.slice(-1);
          if (displayDates.length < maxIdleDays) {
            if (!moment(timeNow).isSame(lastDisplay, "date")) {
              newDisplayDates.push(timeNow);
              StorageUtils.setLocalObject<AdsScenarioData>(scenarioDataKey, { ...scenarioData, displayDates: newDisplayDates });
            }
            showThirdPartyAds = true;
          } else {
            if (!moment(timeNow).isSame(lastDisplay, "date")) {
              StorageUtils.setLocalObject<AdsScenarioData>(scenarioDataKey, { ...scenarioData, isDisplaying: false, lastClick: timeNow, displayDates: [] });
              showThirdPartyAds = false;
            } else {
              showThirdPartyAds = true;
            }
          }
        } else {
          if (displayTime < maxShowTimes && !!lastClick && moment(lastClick).add(hidePeriod.value, hidePeriod.unit).isBefore(moment(timeNow).startOf("day"), "day")) {
            showThirdPartyAds = true;
            currentDisplayTime += 1;
            StorageUtils.setLocalObject<AdsScenarioData>(scenarioDataKey, { ...scenarioData, displayTime: currentDisplayTime, isDisplaying: true, displayDates: [timeNow] });
          }
        }
        setSelectedAds(showThirdPartyAds ? "thirdPartyAds" : "googleAds");
      }
    } else {
      setSelectedAds(!!googleAds ? "googleAds" : null);
    }
  }, [geoInfoLoading, isProAcc]);

  const renderAds = () => {
    if (!selectedAds) return <></>;
    if (selectedAds === "googleAds" && !!googleAds) return <>{googleAds}</>;
    else if (selectedAds === "thirdPartyAds" && thirdPartyAds) {
      const thirdPartyAdsData = _thirdPartyAds[thirdPartyAds.props.name];
      return <>{withScenarioClick(thirdPartyAds, thirdPartyAdsData?.scenarioByUser ? userId : undefined)}</>;
    }
    else return <></>;
  }

  return <>
    {renderAds()}
  </>
}

export default AdsSelector;