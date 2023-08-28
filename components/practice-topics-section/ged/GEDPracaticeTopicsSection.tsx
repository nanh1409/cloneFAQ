import { Grid } from "@mui/material";
import { memo } from "react";
import GoogleAdsense from "../../../features/ads/google-adsense";
import usePracticeData from "../../../hooks/usePracticeData";
import Topic from "../../../modules/share/model/topic";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";

const GEDPracticeTopicsSection = memo(() => {
  const { mapSlugData = {} } = usePracticeData();
  return <div className="practice-topics-section ged">
    <Grid container spacing={2}>
      {Object.entries(mapSlugData).map(([slug, item], i) => {
        return <Grid key={i} item xs={12} sm={6} md={3}>
          <RawLink href={slug} underline="none" color="inherit">
            <TestItem
              item={new Topic({ name: item.name as string, avatar: item.avatar, slug })}
              meta={item.meta}
            />
          </RawLink>
        </Grid>
      })}
    </Grid>
    <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "20px 0" }} />
  </div>
});

export default GEDPracticeTopicsSection;