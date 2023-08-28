import { Button, Card, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ShortUniqueId from "short-unique-id";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_GET_PRO } from "../../../app/router";
import Footer from "../../../components/footer";
import useAppConfig from "../../../hooks/useAppConfig";
import { PAYMENT_BANK } from "../../../modules/share/constraint";
import Order from "../../../modules/share/model/order";
import { PricingPlan } from "../../../modules/share/model/pricingPlan";
import { isValidEmail } from "../../../utils/format";
import CheckoutVipIcon from "../icons/CheckoutVipIcon";
import GetProIcon from "../icons/GetProIcon";
import OnCheckoutIcon from "../icons/OnCheckoutIcon";
import { apiCreateUserPlanOrder } from "../payment.api";
import { checkoutPayment } from "../payment.slice";
import { genOrderCheckSum } from "../payment.utils";
import useGetProConfig, { MapLocalePlanFeatures, PlanFeatures } from "../useGetProConfig";
import "./style.scss";

const uid = new ShortUniqueId({ length: 8 });

const CheckoutPageView = (props: {
  plan?: PricingPlan;
}) => {
  const {
    plan
  } = props;
  const [orderSerial] = useState(`${moment().format("YYYYMMDD")}-${uid()}`);
  const [isOrderCompleted, setOrderCompleted] = useState(false);
  const { user, token } = useSelector((state) => state.authState);
  const isMakingPayment = useSelector((state) => state.paymentState.isMakingPayment);

  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ email: string; }>({
    defaultValues: {
      email: user?.email
    }
  })
  const dispatch = useDispatch();
  const router = useRouter();
  const { multiLocales } = useAppConfig();
  const config = useGetProConfig();
  const planConfig = config.plan[plan.accessLevel];
  const planFeatures = useMemo(() => {
    const mPlanFeatures = config.plan[plan.accessLevel].features;
    return multiLocales ? (mPlanFeatures as MapLocalePlanFeatures)[router.locale] : mPlanFeatures as PlanFeatures;
  }, [router.locale]);

  const features = useMemo(() =>
    multiLocales ? (config.features as MapLocalePlanFeatures)[router.locale] : (config.features as PlanFeatures)
    , [router.locale]);

  const trans = useMemo(() => {
    let paymentDetails = "Payment details",
      orderId = "Order ID",
      emailAddress = "Email address",
      transferInfo = "Transfer information",
      totalPrice = "Total Amount",
      makePayment = "Make Payment",
      completeOrderMsg = "We will send you an activation code to your email as soon as you complete the transfer.",
      reminderActiveCode = "If you have received the activation code,",
      activeNow = "ACTIVE NOW!";

    if (router.locale === "vi") {
      paymentDetails = "Thông tin thanh toán";
      orderId = "Mã đơn hàng";
      emailAddress = "Địa chỉ email";
      transferInfo = "Thông tin chuyển khoản";
      totalPrice = "Tổng cộng";
      makePayment = "Xác nhận thanh toán";
      completeOrderMsg = "Chúng tôi sẽ gửi mã kích hoạt vào email của bạn ngay sau khi bạn hoàn tất chuyển khoản.";
      reminderActiveCode = "Nếu bạn đã nhận được mã kích hoạt,";
      activeNow = "KÍCH HOẠT NGAY"
    }
    return {
      paymentDetails,
      orderId,
      emailAddress,
      transferInfo,
      totalPrice,
      makePayment,
      completeOrderMsg,
      reminderActiveCode,
      activeNow
    }
  }, [router.locale]);

  const handleMakePayment = (args: { email: string }) => {
    if (isOrderCompleted || isMakingPayment) return;
    const {
      email
    } = args;
    // Create Order
    const orderPayload = {
      planId: plan._id,
      paymentMethod: PAYMENT_BANK,
      serial: orderSerial,
      content: `${planConfig.name} Plan`,
      email
    }
    const checkSum = genOrderCheckSum(orderPayload);

    dispatch(checkoutPayment({
      token,
      ...orderPayload,
      checkSum
    }))
      .then(unwrapResult)
      .then((data) => {
        if (!!(data as Order)?._id) {
          setOrderCompleted(true);
        } else {
          enqueueSnackbar("Failed to create Order!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Failed to create Order!", { variant: "error" });
      })
  }

  return <div id="checkout-page-view">
    <Container maxWidth="xl">
      <Card sx={{ p: "10px", mt: "16px", mb: "16px", borderRadius: "10px" }}>
        <Grid container >
          <Grid item xs={12} md={7} pl={3} pr={3} display="flex" flexDirection="column">
            <Box flex={1}>
              <Typography component="h2" color="#000" fontSize="16px" fontWeight={600}>{trans.paymentDetails}</Typography>
              <Box mt={1}>
                <Typography
                  component="span"
                  bgcolor="#F3F5F8"
                  p="6px 20px"
                  borderRadius="3px"
                  border="1px solid #E8EDF4"
                  fontWeight={500}
                >{trans.orderId}: <b>{orderSerial}</b></Typography>
              </Box>

              <Typography className="checkout-input-label" component="label" htmlFor="checkout-email-address" mt={1}>
                {trans.emailAddress}&nbsp;
              </Typography>
              <Box>
                <TextField
                  id="checkout-email-address"
                  type="email"
                  size="small"
                  required
                  className="checkout-input-element"
                  InputProps={{
                    classes: {
                      focused: "checkout-input-element-focused"
                    }
                  }}
                  {...register("email", { required: true, validate: (email) => isValidEmail(email) })}
                />
                {errors.email && <Typography color="red" fontStyle="italic" fontSize="12px">
                  {errors.email.type === "required" && "This field is required!"}
                  {errors.email.type === "validate" && "Invalid Email!"}
                </Typography>}
              </Box>

              <Typography mt={3}>
                {trans.transferInfo}:
                <br />
                ...
              </Typography>
            </Box>

            <Divider sx={{ mb: "10px" }} />
            <div className="checkout-information-panel">
              <div className="checkout-information-panel-label">
                {trans.totalPrice}
              </div>
              <div className="checkout-information-panel-value">
                {plan.price}&#8363;
              </div>
            </div>

            <Box pb={6} mt={4} display="flex" justifyContent="center">
              {!isOrderCompleted
                ? <Button
                  variant="contained"
                  onClick={handleSubmit(handleMakePayment)}
                  sx={{ minWidth: "150px", bgcolor: "#164AFF !important" }}
                  disabled={isMakingPayment}
                >
                  {isMakingPayment ? <OnCheckoutIcon /> : trans.makePayment}
                </Button>
                : <div className="checkout-complete-info">
                  {trans.completeOrderMsg}&nbsp;
                  {trans.reminderActiveCode}&nbsp;<span className="checkout-complete-active-link" onClick={() => {
                    router.push({
                      pathname: `/${ROUTER_GET_PRO}`,
                      query: {
                        from: "checkout"
                      }
                    })
                  }}>
                    {trans.activeNow}
                  </span>
                </div>}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <div className="checkout-plan-details">
              <div
                className="checkout-plan-details-header"
                style={{
                  backgroundImage: `url(/images/get-pro/checkout-plan-details-bg.png)`
                }}
              >
                <GetProIcon accessLevel={plan.accessLevel} fill="#fff" />
                <span className="plan-name">{planConfig.name}</span>
                <Button disabled className="checkout-vip-btn" startIcon={<CheckoutVipIcon />}>BECOME VIP</Button>
              </div>

              <div className="checkout-plan-details-body">
                <ul className="plan-features">
                  {features.map((feature: string, i) => {
                    const planFeature = planFeatures[i];
                    return <Fragment key={i}>
                      <li className={classNames(
                        "plan-features-item",
                        !planFeature ? "disabled" : ""
                      )}>{planFeature === "string" ? planFeature : feature}</li>
                    </Fragment>
                  })}
                </ul>
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </Container>
    <Footer />
  </div>
}

export default CheckoutPageView;