import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithoutRef, ReactNode, useMemo } from "react";
import useAppConfig from "../../../hooks/useAppConfig";
import { PricingPlan } from "../../../modules/share/model/pricingPlan";
import CheckFeatureIcon from "../icons/CheckFeatureIcon";
import GetProIcon from "../icons/GetProIcon";
import useGetProConfig, { GetProConfig, MapLocalePlanFeatures, PlanFeatures, SelectedPlanData } from "../useGetProConfig";
import "./style.scss"

const SwiperSlidePlan = (props: PropsWithoutRef<{
  accessLevel: number;
  planConfig: GetProConfig["plan"][number];
  planFeatures: PlanFeatures;
  mapSubsKeyPlan?: { [subsKey: string]: PricingPlan[] };
  handleOpenPaymentDialog?: (args: SelectedPlanData) => void;
  disableFooter?: boolean;
}>) => {
  const {
    accessLevel,
    planConfig,
    planFeatures,
    mapSubsKeyPlan = {},
    handleOpenPaymentDialog = () => { },
    disableFooter
  } = props;

  const { name, totalPrice } = planConfig;
  const router = useRouter();
  const config = useGetProConfig();
  const { multiLocales } = useAppConfig();

  const features = useMemo(() =>
    multiLocales ? (config.features as MapLocalePlanFeatures)[router.locale] : (config.features as PlanFeatures)
    , [router.locale]);

  return <div className="swiper-slide-plan">
    <div className="swiper-slide-header">
      <GetProIcon accessLevel={accessLevel} />
      {name}
    </div>

    <div className="swiper-slide-body">
      {features.map((feature: string, i) => {
        const planFeature = planFeatures[i];
        return <div key={i} className={classNames("slide-get-pro-feature", !(i % 2) ? "dim" : "")}>
          <CheckFeatureIcon fill={(typeof planFeature === "string" || !planFeature) ? "#aaa" : undefined} />
          <div className="slide-get-pro-feature-detail">
            <div className={classNames("feature-item", (typeof planFeature === "string" || !planFeature) ? "disabled" : "")}>{feature}</div>
            {typeof planFeature === "string" && <div className="plan-feature-item">{planFeature}</div>}
          </div>
        </div>
      })}
    </div>

    {!disableFooter && <div className="swiper-slide-footer">
      {accessLevel === 0
        ? <div className="btn-get-pro btn-free">FREE</div>
        : Object.entries(totalPrice || {}).map(([subsKey, dataPrice]) => {
          const appPlan = mapSubsKeyPlan[subsKey]?.find((e) => e.currencyCode === "USD") ?? {} as PricingPlan;
          const subsTime =
            // appPlan.subscriptionTimeUnit === "year"
            // ? `${appPlan.subscriptionTimeValue * 12} months`
            // :
            `${appPlan.subscriptionTimeValue} ${appPlan.subscriptionTimeUnit}${appPlan.subscriptionTimeValue !== 1 ? "s" : ""}`
          return <div className={classNames("btn-get-pro", dataPrice.primary ? "primary" : "")} onClick={() => handleOpenPaymentDialog({
            subsType: subsKey,
            planName: name,
            price: {
              "en": <>${(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "USD") ?? {} as PricingPlan).price}</>,
              "vi": <>{(mapSubsKeyPlan[subsKey].find((e) => e.currencyCode === "VND") ?? {} as PricingPlan).price}&#8363;</>
            }
          })}>
            {!!dataPrice.price && <><span className="data-total-price">{dataPrice.price}</span>&nbsp;&nbsp;</>}
            <span className="data-plan-price">{appPlan.price}$&nbsp;</span>
            <span className="data-plan-subs-time">/{subsTime}</span>
          </div>
        })}
    </div>}
  </div>
}

export default SwiperSlidePlan;