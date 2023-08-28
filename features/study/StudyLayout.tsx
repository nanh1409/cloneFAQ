import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { useSelector } from "../../app/hooks";
import Layout, { LayoutProps } from "../common/Layout";
import useUserPaymentInfo from "../get-pro/useUserPaymentInfo";
import StudyHeader from "./StudyHeader";
import useAppConfig from "../../hooks/useAppConfig";

const DetectAdBlock = dynamic(() => import("../ads/detect-adblock"), { ssr: false });

const StudyLayout = (props: PropsWithChildren<LayoutProps & {
  stickyHeader?: boolean;
  onStudySEOPage?: boolean;
  detectAdBlock?: boolean;
}>) => {
  const theme = useTheme();
  const { useAds } = useAppConfig();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const { paymentLoading, planAccessLevel } = useUserPaymentInfo();
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  return (<Layout {...props}
    backgroundColor={props.backgroundColor ? props.backgroundColor : (isTabletUI ? "#FDFDFE" : "#F2F3F7")}
    disableDefaultHeader={!props.onStudySEOPage}
    noAlternateLink
  >
    {!props.onStudySEOPage && <StudyHeader sticky={props.stickyHeader} />}
    {props.children}
    {useAds && props.detectAdBlock && (!appInfo.usingGetPro || (!paymentLoading && planAccessLevel === 0))  && <DetectAdBlock />}
  </Layout>)
}

export default StudyLayout;