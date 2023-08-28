import { Grid } from "@mui/material";
import { memo } from "react";
import usePracticeData from "../../../hooks/usePracticeData";
import Topic from "../../../modules/share/model/topic";
import { TestMeta } from "../../../types/appPracticeTypes";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";

const ALEVELPracticeTopicsSection = memo(() => {
  const { mapSlugData = {} } = usePracticeData();
  return <div className="practice-topics-section alevel-maths">
    <Grid container spacing={2}>
      {Object.entries(mapSlugData).map(([slug, item], i) => {
        return <Grid key={i} item xs={12} sm={6} md={4}>
          <RawLink href={`${slug}`} underline="none" color="inherit">
            <TestItem
              item={new Topic({ name: item.name as string, avatar: item.avatar, slug })}
              meta={item.meta}
            />
          </RawLink>
        </Grid>
      })}
    </Grid>
  </div>
});

export default ALEVELPracticeTopicsSection;