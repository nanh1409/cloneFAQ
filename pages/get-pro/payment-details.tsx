import { Box, Card, Container, Divider, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo } from "react";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import usePageAuth from "../../hooks/usePageAuth";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import { PAYMENT_PAYPAL, PAYMENT_VNPAY } from "../../modules/share/constraint";
import AppSetting from "../../modules/share/model/appSetting";
import { mapPaymentType, mapVnpRspCodeReturn, PayPalPaymentDetailsParams, VNPayPaymentDetailsParams } from "../../types/PaymentDetailParams";
import { getWebAppProps } from "../../utils/getSEOProps";

const Layout = dynamic(() => import("../../features/common/Layout"), { ssr: false });

const PaymentInfoBox = styled(Box)({ display: "flex", justifyContent: "space-between", alignItems: "center", columnGap: 16, mb: "6px" });
const PaymentInfoText = styled("span")({ color: "#515151", fontSize: "16px" });

const GetProPaymentDetailsPage = (props: { appInfo: AppSetting }) => {
  const { appInfo } = props;
  usePageAuth();
  const router = useRouter();
  const {
    content, status, failReason, orderTime, amount, serial, paymentType, valid
  } = useMemo(() => {
    let content = "";
    let status = "";
    let failReason = "";
    let orderTime = "";
    let amount: ReactNode = "";
    let serial = "";
    const paymentType = +router.query.paymentType;
    let valid = false;
    if (paymentType === PAYMENT_PAYPAL) {
      valid = true;
      const data = router.query as PayPalPaymentDetailsParams;
      content = data.content;
      status = data.status === "success" ? "Success" : "Failed";
      orderTime = moment(+data.orderTime).format("HH:mm:ss DD-MM-YYYY");
      amount = `$${data.amount || 0}`;
      serial = data.serial;
    } else if (paymentType === PAYMENT_VNPAY) {
      valid = true;
      const data = router.query as VNPayPaymentDetailsParams;
      content = data.content;
      status = data.responseCode === "00" ? "Success" : "Failed";
      failReason = data.responseCode !== "04" ? mapVnpRspCodeReturn[data.responseCode] : "";
      orderTime = moment(+data.orderTime).format("HH:mm:ss DD-MM-YYYY");
      amount = <>{data.amount || 0}&#8363;</>;
      serial = data.serial;
    }
    return {
      content, status, failReason, orderTime, amount, serial, paymentType, valid
    }
  }, [router.query]);

  return <Layout
    {...getWebAppProps(appInfo)}
    title="Get Pro | Payment Details"
    backgroundColor="#ebebeb"
  >
    <div id="payment-details-result">
      {valid && <Container maxWidth="xl">
        <Card sx={{ maxWidth: 500, m: "30px auto", p: "8px 24px", bgcolor: "#fff", borderRadius: "10px" }}>
          <Typography fontWeight="700">Payment Details</Typography>
          <Divider sx={{ borderStyle: "dashed", mt: "6px", mb: "6px" }} />
          <Typography component="h1" fontSize="18px" fontWeight={600} textAlign="center" mb="6px">{status}</Typography>
          {status !== "Success" && failReason && <Typography textAlign="center" fontStyle="italic" fontSize="14px" color="red">{failReason}</Typography>}

          <PaymentInfoBox>
            <PaymentInfoText>Order ID</PaymentInfoText>
            <PaymentInfoText>{serial}</PaymentInfoText>
          </PaymentInfoBox>

          <PaymentInfoBox>
            <PaymentInfoText>Content</PaymentInfoText>
            <PaymentInfoText>{content}</PaymentInfoText>
          </PaymentInfoBox>

          <PaymentInfoBox>
            <PaymentInfoText>Date</PaymentInfoText>
            <PaymentInfoText>{orderTime}</PaymentInfoText>
          </PaymentInfoBox>

          <PaymentInfoBox>
            <PaymentInfoText>Payment Method</PaymentInfoText>
            <PaymentInfoText>{mapPaymentType[paymentType]}</PaymentInfoText>
          </PaymentInfoBox>

          <PaymentInfoBox>
            <PaymentInfoText>Total</PaymentInfoText>
            <PaymentInfoText>{amount}</PaymentInfoText>
          </PaymentInfoBox>

        </Card>
      </Container>}
    </div>
    <Footer />
  </Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  if (!appInfo.usingGetPro) return {
    // redirect: {
    //   destination: "/",
    //   permanent: false
    // }
    notFound: true
  }

  return {
    props: {
      appInfo
    }
  }
});

export default GetProPaymentDetailsPage;