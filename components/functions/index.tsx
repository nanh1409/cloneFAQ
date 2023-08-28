import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useSelector } from '../../app/hooks';
import useAppConfig from "../../hooks/useAppConfig";
import CtaButton from "../CtaButton";
import "./style.scss";
import WebFunctions from './web-functions';
import dynamic from 'next/dynamic';
import { useMemo } from "react";

const AppFunctions = dynamic(() => import('./app-functions'));
const AppFunctionsVerTwo = dynamic(() => import('./app-functions/indexVer2'));
const IconBtnDoTest = dynamic(() => import("./iconBtnDoTest"), { ssr: false })

const Functions = () => {
  const { appName } = useSelector((state) => state.appInfos.appInfo);
  const data = useAppConfig();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const trans = useMemo(() => {
    let webFunction = "Web Functions",
      practiceCtaBtn = `DO ${appName.toUpperCase()} TEST ON OUR WEBSITE NOW!`,
      appFunctions = "App Functions";
    if (router.locale === "vi") {
      webFunction = "Chức năng của Web";
      practiceCtaBtn = 'Làm bài thi thử ngay!';
      appFunctions = "Chức năng của App";
    }
    return {
      webFunction,
      practiceCtaBtn,
      appFunctions
    }
  }, [router.locale, appName]);

  return (
    <div id="functions" style={data.uiVersion === 2 ? { background: "#fff" } : {}}>
      <div id="web-function" style={data.uiVersion === 2 ? { background: "#F5F7FB", padding: "50px 0 70px 0" } : {}}>
        <Container maxWidth="xl">
          <h2 className="title-function">{trans.webFunction}</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} sx={{ width: '100%', height: '100%' }} display="flex" justifyContent="center">
              <div style={{
                position: 'relative',
                width: isTabletUI ? '55%' : '100%',
                height: isTabletUI ? '55%' : '100%',
                maxHeight: 452
              }}>
                <Image layout='responsive' width="100%" height="100%" objectFit='contain' src={`/images/app/${appName}/img-web-function.png`} alt="web-functions" />
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <WebFunctions />
            </Grid>
          </Grid>
          <div className="cta-go-test-web">
            <CtaButton
              url={data.testSlug || "#"}
              title={trans.practiceCtaBtn}
              color={`var(--btnTestTitleColor)`}
              endIcon={<IconBtnDoTest />}
              backgroundColor={`var(--btnTestBackground)`}
              backgroundLayerColor={`var(--btnTestBackgroundLayer)`}
              titleClassName="cta-go-test-web-button-title"
              buttonClassName="cta-go-test-web-button"
              borderRadius={27}
            />
          </div>
        </Container>
      </div>
      <Container maxWidth="xl">
        {data.uiVersion === 2 && appName === 'toeic'
          ? <div id={"app-function-ver2"} className={isTabletUI || isMobileUI ? "app-function-ver2-tablet" : ""}>
            <h2 className="title">{trans.appFunctions}</h2>
            <p className="sub-title">{router.locale === "en" ? "Our app has following outstanding features" : "Ứng dụng của chúng tôi có các tính năng nổi bật sau"}</p>
            <AppFunctionsVerTwo isTabletUI={isTabletUI || isMobileUI} />
          </div>
          : <div id="app-function">
            <h2 className="title-function">{trans.appFunctions}</h2>
            <AppFunctions />
          </div>
        }
      </Container>
    </div>
  )
}

export default Functions