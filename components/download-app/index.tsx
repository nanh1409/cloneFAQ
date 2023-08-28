import { Container, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "../../app/hooks";
import DefaultAppDownloadButton from "../../features/common/AppDownloadButton/DefaultAppDownloadButton";
import useAppConfig from "../../hooks/useAppConfig";
import NextLink from "../NextLink";
import "./style.scss";

const DownloadApp = () => {
  const { appName, linkGooglePlay, linkAppStore, siteAddress } = useSelector(
    (state) => state.appInfos.appInfo
  );
  const appConfig = useAppConfig();
  const router = useRouter();
  const downloadApp = router.locale === "en"
    ? "Download The App" : router.locale === "vi" ? "Tải ứng dụng" : ''
  const downloadNow1 = router.locale === "en"
    ? "Download The App" : router.locale === "vi" ? "Tải ứng dụng" : ''
  const downloadNow2 = router.locale === "en"
    ? <div>Do the <b>{appName.toUpperCase()}</b>  Test on our Website NOW!</div> : router.locale === "vi" ? <div>Luyện tập <b>{appName.toUpperCase()} </b>ngay hôm nay!</div> : ''
  const doTest = router.locale === "en"
    ? <div>Do the <b>{appName.toUpperCase()}</b> Test </div> : router.locale === "vi" ? <div>Làm bài thi <b>{appName.toUpperCase()} </b></div> : ''


  return (
    <div id="download-app">
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="end" pt={4} justifyContent="center" margin="auto" width="100%">
          <Grid item xs={12} sm={4} md={4}>
            <div style={{ position: 'relative', width: '100%', height: '100%', transform: "translateY(9px)" }}>
              <Image width="100%" layout="responsive" height="100%" objectFit='contain' src={`/images/app/${appName}/download-app.png`} alt="download-app" className="img-download" quality={100} />
            </div>
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <div className="content-direction">
              <div className="title">
                {downloadNow1}
              </div>
              <div
                className="description"
              >
                {downloadNow2}
              </div>
              <div className="cta-download-app-container">
                <div className="cta-download-app-qr-container">
                  <QRCodeCanvas value={`${siteAddress}/qrcode`} width={128} height={128} size={128} />
                </div>
                <div className="cta-download-app-right">
                  <div className="cta-download-app-button-group">
                    <DefaultAppDownloadButton source="chplay" />
                    <DefaultAppDownloadButton source="appstore" />
                  </div>
                  <div className="btn-link">
                    <NextLink
                      href={appConfig.testSlug || "#"}
                    >
                      {doTest}
                    </NextLink>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div >
  );
};

export default DownloadApp;
