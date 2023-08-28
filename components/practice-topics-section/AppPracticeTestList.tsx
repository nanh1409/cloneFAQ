import { Grid, Typography } from '@mui/material';
import _ from "lodash";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { useSelector } from '../../app/hooks';
import { ROUTER_STUDY } from '../../app/router';
import usePracticeData from "../../hooks/usePracticeData";
import RawLink from '../RawLink';
import TestItem from "../test-item";

const GoogleAdsense = dynamic(() => import("../../features/ads/google-adsense"), { ssr: false });
const ALEVELPracticeTopicsSection = dynamic(() => import('./alevel-maths/ALEVELPracticeTopicsSection'));
const CDLPracticeTopicsSection = dynamic(() => import("./cdl/CDLPracticeTopicsSection"));
const DMVPracticeTopicsSection = dynamic(() => import("./dmv/DMVPracticeTopicsSection"));
const GEDPracticeTopicsSection = dynamic(() => import("./ged/GEDPracaticeTopicsSection"));
const IELTSPracticeTopicsSection = dynamic(() => import("./ielts/IELTSPracticeTopicsSection"));
const NCLEXPracticeTopicsSection = dynamic(() => import("./nclex/NCLEXPracticeTopicsSection"));
const TOEICPracticeTopicsSection = dynamic(() => import("./toeic/TOEICPracticeTopicsSection"));

const AppPracticeTestList = () => {
  const { appName } = useSelector((state) => state.appInfos.appInfo);
  const practiceList = useSelector((state) => state.appInfos.practiceList);
  const { mapSlugData = {}, mapTagName = {} } = usePracticeData();

  switch (appName) {
    case "cscs":
      const cscsPracticeTags = _.uniq(Object.values(mapSlugData).map(({ tag }) => tag));
      return <>
        {cscsPracticeTags.map((tag, i) => {
          const practiceSlugs = Object.keys(mapSlugData).filter((slug) => mapSlugData[slug]?.tag === tag);
          const practices = practiceList.filter((topic) => practiceSlugs.includes(topic.slug));
          return <Fragment key={i}>
            <Typography component="h2" sx={{
              fontWeight: 600, fontSize: 32, color: 'var(--titleColor)', mb: "36px", mt: "50px"
            }}>{mapTagName[tag] as string}</Typography>
            <Grid container spacing={3}>
              {practices.map((topic, i) => {
                return <Grid key={topic._id} item xs={12} sm={6} md={2.4}>
                  <RawLink href={`/${ROUTER_STUDY}/${topic.slug}`}>
                    <TestItem item={topic} meta={mapSlugData[topic.slug].meta ?? []} />
                  </RawLink>
                </Grid>
              })}
            </Grid>
            {!i && <GoogleAdsense name="PracticeHomeBannerAds" style={{ marginTop: 50 }} />}
          </Fragment>
        })}
      </>;
    case "asvab":
      return <>
        <Grid container spacing={3}>
          {practiceList.map((topic, i) => {
            return <Grid key={topic._id} item xs={12} sm={6} md={2.4}>
              <RawLink href={`/${ROUTER_STUDY}/${topic.slug}`}>
                <TestItem item={topic} meta={mapSlugData[topic.slug].meta ?? []} />
              </RawLink>
            </Grid>
          })}
        </Grid>
        <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "20px 0" }} />
      </>;

    case "toeic":
      return <TOEICPracticeTopicsSection />;
    case "nclex":
      return <NCLEXPracticeTopicsSection />;
    case "ged":
      return <GEDPracticeTopicsSection />;
    case "hvac":
      return <>
        <Grid container spacing="30px">
          {practiceList.map((topic) => {
            return <Grid key={topic._id} item xs={12} sm={6} md={4}>
              <RawLink href={`/${ROUTER_STUDY}/${topic.slug}`}>
                <TestItem item={topic} meta={mapSlugData[topic.slug]?.meta ?? []} />
              </RawLink>
            </Grid>
          })}
        </Grid>
      </>;
    case "alevel":
      return <ALEVELPracticeTopicsSection />;
    case "dmv":
      return <DMVPracticeTopicsSection />;
    case "cdl":
      return <CDLPracticeTopicsSection />;
    case "ielts":
      return <IELTSPracticeTopicsSection />;
    default:
      return <></>;
  }
}

export default AppPracticeTestList