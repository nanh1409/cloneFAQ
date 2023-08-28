import { Container, Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef } from "react";
import { useSelector } from "../../app/hooks";
import { ROUTER_PRACTICE_SW } from "../../app/router";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import Introduction from "../../components/introduction";
import PartItemData, { PartItemDataProps } from "../../components/practice-topics-section/toeic/PartItem";
import TestItemPanel from "../../components/practice-topics-section/toeic/TestItemPanel";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import useAppConfig from "../../hooks/useAppConfig";
import usePageAuth from "../../hooks/usePageAuth";
import usePracticeData from "../../hooks/usePracticeData";
import WebSeo from "../../modules/share/model/webSeo";
import { MapLocaleString } from "../../types/appPracticeTypes";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

const GoogleAdsense = dynamic(() => import("../../features/ads/google-adsense"), { ssr: false });

const usePracticePageStyles = makeStyles((theme: Theme) => ({
  practiceTitle: { fontSize: 48, fontWeight: 700, textAlign: "center", margin: "20px 0", color: "var(--titleColor)" },
  practiceItemTitle: { fontSize: 35, fontWeight: 700, marginTop: 50, marginBottom: 30, color: "var(--titleColor)" },
  toeicSpecialPractice: { display: "flex", gap: "20px", [theme.breakpoints.down("lg")]: { flexDirection: "column" }, marginTop: 50 },
  ieltsMeta: { display: "flex", columnGap: "10px" },
  ieltsShortDesc: {
    height: "120px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", "-webkit-box-orient": "vertical", "-webkit-line-clamp": 5
  }
}));

type PracticePageProps = {
  seoInfo: WebSeo,
}

const PracticeSWPage = (props: PropsWithoutRef<PracticePageProps>) => {
  const classes = usePracticePageStyles();
  const { seoInfo } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { mapSlugData = {}, mapTagName = {} } = usePracticeData();
  const router = useRouter();
  const appConfig = useAppConfig();
  const appName = appConfig.appName;

  usePageAuth();


  const renderPracticeList = () => {
    if (appName === "toeic") {
      const toeicSkills = _.uniq(Object.values(mapSlugData).map(({ tag }) => tag)).filter((tag) => ['speaking', 'writing'].includes(tag));
      const mapSkillData = Object.entries(mapSlugData).reduce((map, [slug, { name, fullName, shortDescription, ...data }]) => {
        if (!!data.tag) {
          map[data.tag] = [...(map[data.tag] || []), {
            ...data,
            slug: !!data.children ? "" : `/${ROUTER_PRACTICE_SW}/${slug}`,
            shortName: (name as MapLocaleString)[router.locale],
            name: (fullName as MapLocaleString)[router.locale],
            shortDescription: (shortDescription as MapLocaleString)[router.locale],
            childs: !!data.children ? Object.entries(data.children).map(([slug, cData]) => ({
              name: (cData.name as MapLocaleString)[router.locale],
              slug: `/${ROUTER_PRACTICE_SW}/${slug}`
            })) : undefined
          }];
        }
        return map;
      }, {} as {
        [tag: string]: PartItemDataProps[]
      })

      return <Container maxWidth="xl">
        {toeicSkills.map((tag, i) => {
          return <div className="part-item" key={i}>
            <Typography className={classNames("part-item-name", classes.practiceItemTitle)} component="div">{mapTagName[tag][router.locale]}</Typography>
            <Grid className="part-item-data-container" container spacing={2}>
              {mapSkillData[tag].map((itemData, itemDataIdx) => {
                return <Grid key={itemDataIdx} item xs={12} sm={6} md={3}>
                  <PartItemData {...itemData} />
                </Grid>
              })}
            </Grid>
            {!i && <GoogleAdsense name="TestBannerAds" height={180} style={{ marginTop: 30 }} />}
          </div>
        })}
        <div className={classNames("special-practice-panel", classes.toeicSpecialPractice)}>
          <TestItemPanel
            title="VOCABULARY"
            description="Our vocabulary practice divided into various topics and parts will assist you in boosting your vocabulary range"
            slug="/practice/vocabulary"
            bgImage="/images/app/toeic/vocabulary.png"
          />

          <TestItemPanel
            title="GRAMMAR"
            description="Our grammar exercises covering 30+ grammar topics will definitely help you enhance your English foundation"
            slug="/practice/grammar"
            bgImage="/images/app/toeic/grammar.png"
          />
        </div>
      </Container>
    }
    return <></>
  }

  return (<Layout
    {...getWebSEOProps(seoInfo)}
    {...getWebAppProps(appInfo)}
  >
    <Typography component="h1" className={classes.practiceTitle}>{seoInfo?.titleH1}</Typography>
    {renderPracticeList()}
    <Introduction content={seoInfo?.content} />
    <Footer />
  </Layout>)
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, locale, defaultLocale }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  if (!["toeic"].includes(appName)) return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  if (!appInfo) return {
    notFound: true
  }
  store.dispatch(setAppInfo(appInfo));
  const slug = locale === defaultLocale ? "/practice-speaking-writing" : `/${locale}/practice-speaking-writing`;
  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  // store.dispatch(setSEOInfo(seoInfo))
  store.dispatch(setKeySEOInfo(seoInfo));

  return {
    props: {
      seoInfo,
    },
    // revalidate: 600
  }
});

export default PracticeSWPage