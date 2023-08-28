import { Container, Grid, Link } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "../../app/hooks";
import DefaultAppDownloadButton from "../../features/common/AppDownloadButton/DefaultAppDownloadButton";
import useAppConfig from "../../hooks/useAppConfig";
import AppSetting from "../../modules/share/model/appSetting";
import NextLink from "../NextLink";

const DownloadAppVerTwo = () => {
    const appConfig = useAppConfig();
    const router = useRouter();
    const { appName } = useSelector((state) => state.appInfos.appInfo);
    const { linkGooglePlay, linkAppStore } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);

    const downloadApp = router.locale === "en"
        ? "Download The App" : router.locale === "vi" ? "Tải ứng dụng" : ''
    const downloadNow1 = router.locale === "en"
        ? "Download The App" : router.locale === "vi" ? "Tải ứng dụng" : ''
    const downloadNow2 = router.locale === "en"
        ? <>Do the <b>{appName.toUpperCase()}</b>  Test on our Website NOW!</> : router.locale === "vi" ? <>Luyện tập <b>{appName.toUpperCase()} </b>ngay hôm nay!</> : ''
    const doTest = router.locale === "en"
        ? <>Do the <b>{appName.toUpperCase()}</b> Test </> : router.locale === "vi" ? <>Làm bài thi <b>{appName.toUpperCase()} </b></> : ''

    return (
        <div id="downloadAppVerTwo">
            <Container maxWidth="xl" className="download-app-container">
                <Grid container spacing={1} alignItems="end" justifyContent="center" margin="auto" width="100%">
                    <Grid item xs={12} sm={4} md={4}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', transform: "translateY(9px)" }}>
                            <Image width="100%" layout="responsive" height="100%" objectFit='contain' src={`/images/app/${appName}/download-app.png`} alt="download-app" className="img-download" quality={100} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={8} md={8}>
                        <div className="download-app-box">
                            <h3>{downloadNow1}</h3>
                            <h5>{downloadNow2}</h5>
                            <Grid container spacing={0} className="download-app-button">
                                <Grid item xs={12} sm={6}>
                                    <DefaultAppDownloadButton source="chplay" />
                                    {/* <AppDownloadButton
                                        source="chplay"
                                        link={linkGooglePlay}
                                        color="#fff"
                                        hoverColor="#636CF5"
                                        background="#636CF5"
                                        hoverBackround="#fff"
                                    />   */}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DefaultAppDownloadButton source="appstore" />
                                    {/* <AppDownloadButton
                                        source="appstore"
                                        link={linkAppStore}
                                        color="#fff"
                                        hoverColor="#636CF5"
                                        background="#636CF5"
                                        hoverBackround="#fff"
                                    /> */}
                                </Grid>
                                <Grid item xs={12} style={{ paddingTop: 17 }}>
                                    <div style={{ padding: '0 10px' }}>
                                        <NextLink
                                            href={appConfig.testSlug || "#"}
                                        >
                                            <div className="btn-test right">
                                                {doTest}
                                            </div>
                                        </NextLink>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default DownloadAppVerTwo