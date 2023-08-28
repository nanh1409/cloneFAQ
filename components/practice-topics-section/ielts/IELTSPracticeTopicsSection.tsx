import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { ROUTER_PRACTICE } from "../../../app/router";
import GoogleAdsense from "../../../features/ads/google-adsense";
import usePracticeData from "../../../hooks/usePracticeData";
import Topic from "../../../modules/share/model/topic";
import { MapLocaleString } from "../../../types/appPracticeTypes";
import NextLink from "../../NextLink";
import TestItem from "../../test-item";
import TestItemPanel from "../toeic/TestItemPanel";
import "./ieltsPracticeStyles.scss";

const IELTSPracticeTopicsSection = () => {
  const router = useRouter();
  const { mapSlugData = {} } = usePracticeData();
  return <div className="practice-topics-section ielts">
    <div className="part-container-panel">
      <Grid container spacing={3}>
        {Object.entries(mapSlugData).map(([slug, item], i) => {
          return <Grid key={i} item xs={12} sm={6} md={4}>
            <NextLink href={`/${ROUTER_PRACTICE}/${slug}`}>
              <TestItem
                item={{
                  name: (item.name as MapLocaleString)[router.locale],
                  avatar: item.avatar,
                  shortDescription: (item.shortDescription as MapLocaleString)[router.locale]
                } as Topic}
                meta={item.meta}
                useShortDesc
                classes={{
                  metaItem: "single-meta",
                  shortDesc: "ielts-part-short-desc dot-5"
                }} />
            </NextLink>
          </Grid>
        })}
      </Grid>
    </div>
    <div className="test-container-panel">
      <TestItemPanel
        title="FULL TEST"
        description="Take full test with the same number of questions and time limit as the actual test"
        slug="/full-test"
        bgImage="/images/app/ielts/full-test.png"
        classes={{
          title: "ielts-test-title",
          description: "ielts-test-desc",
          joinButtonWrap: "ielts-join-test-wrap",
          joinButton: "ielts-join-test"
        }}
      />
    </div>

    <GoogleAdsense name="The_Leaderboard" height={90} />
  </div>
}
export default IELTSPracticeTopicsSection;