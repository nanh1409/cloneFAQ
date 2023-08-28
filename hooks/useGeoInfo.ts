import { useEffect } from "react";
import { useDispatch } from "../app/hooks";
import { isThirdPartyAdsLocaleCheckRequired } from "../features/ads/third-party-ads/thirdPartyAdsConfig";
import { fetchGeoInfo } from "../features/common/layout.slice";

export default function useGeoInfo() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isThirdPartyAdsLocaleCheckRequired()) {
      dispatch(fetchGeoInfo());
    }
  }, []);
}