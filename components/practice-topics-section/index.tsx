import { Container, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useMemo } from "react";
import useAppConfig from "../../hooks/useAppConfig";
import usePracticeData from "../../hooks/usePracticeData";
import WebSeo from "../../modules/share/model/webSeo";
import { MapLocalePracticeContent, PracticeContent } from "../../types/appPracticeTypes";
import AppPracticeTestList from "./AppPracticeTestList";
import "./style.scss";

const AdsSelector = dynamic(() => import("../../features/ads/AdsSelector"), { ssr: false });
const GoogleAdsense = dynamic(() => import("../../features/ads/google-adsense"), { ssr: false });
const ThirdPartyAds = dynamic(() => import("../../features/ads/third-party-ads"), { ssr: false });

const PracticeTopicsSection = (props: PropsWithoutRef<{
  year: number;
  seoInfo?: WebSeo;
}>) => {
  const { year, seoInfo } = props;
  const router = useRouter();
  const { appName, multiLocales, uiVersion } = useAppConfig();
  const { seoContent = {} } = usePracticeData();
  const { title = '', content = '' } = useMemo(() =>
    (multiLocales ? (seoContent as MapLocalePracticeContent)[router.locale] : seoContent as PracticeContent) || {} as PracticeContent,
    [router.locale]
  );

  const practiceTitle = useMemo(() => {
    let _title = title.replace("%year%", `${year}`);
    if (uiVersion === 2) _title = seoInfo?.titleH1;
    return _title
  }, [uiVersion, title, seoInfo]);
  const practiceContent = useMemo(() => {
    let _content = content.replace("%year%", `${year}`);
    if (uiVersion === 2) _content = seoInfo?.summary;
    return _content;
  }, [uiVersion, content, seoInfo]);

  return (
    <div id="practice-topics-section">
      <Container maxWidth="xl" id="practice">
        {["ged", "asvab", "toeic", "ielts"].includes(appName) && <>
          <AdsSelector
            googleAds={<GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "10px 0" }} />}
            thirdPartyAds={["toeic"].includes(appName) && <ThirdPartyAds name="getpro-toeic" type="728x90" style={{ margin: "10px auto", textAlign: "center" }} storageKey="index_practice" enableCheckUpgradeCached />}
          />
        </>}
        <div className="text-seo">
          <Typography component={uiVersion === 2 ? "h1" : "h2"} className="title-h2">{practiceTitle}</Typography>
          <p className="desc" dangerouslySetInnerHTML={{ __html: practiceContent }} />
        </div>

        <AppPracticeTestList />
      </Container >
    </div >
  )
}

export default PracticeTopicsSection